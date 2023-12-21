using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;

using Mod.Ethics.Infrastructure.EfCore;
using Mod.Framework.Configuration;
using Mod.Framework.User;
using Mod.Framework.Runtime.Session;

namespace Mod.Ethics.Migration
{
    class Program
    {
        static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                         .MinimumLevel.Information()
                         .Enrich.WithCorrelationId()
                         .Destructure.ByTransforming<ExpandoObject>(e => new Dictionary<string, object>(e)) // see https://stackoverflow.com/questions/48958444/serilog-and-expandoobject
                         .WriteTo.Console(outputTemplate: "{Timestamp:yyyy-MM-ddTHH:mm:ss.ffffff} {Level} {CorrelationId} {SourceContext} {Message:lj} {NewLine}")
                         .CreateLogger();

            ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
            {
                builder.AddSerilog();
            });

            try
            {
                MigrateEthicsDatabase(loggerFactory);
                MigrateUserDatabase(loggerFactory);
            }
            catch (Exception ex)
            {
                Log.Fatal("An exception occurred: {Exception}", ex.Message);
                Log.Fatal("{@Exception}", ex);
                throw;
            }

            Log.Information("--------------------------- Migration Complete --------------------------");
        }


        private static void MigrateEthicsDatabase(ILoggerFactory loggerFactory)
        {
            var connectionString = ConfigurationManager.Secrets["MOD_Ethics_ConnectionString"];

            var optionsBuilder = new DbContextOptionsBuilder<EthicsContext>();

            optionsBuilder
                .UseSqlServer(connectionString)
                .UseLoggerFactory(loggerFactory)
                .EnableDetailedErrors()
                .EnableSensitiveDataLogging()
                .UseLazyLoadingProxies();

            var context = new EthicsContext(optionsBuilder.Options, NullModSession.Instance);
            Log.Information("--------------------------- Starting Ethics Migration --------------------------");

            var t0 = DateTime.Now;
            context.Database.Migrate();

            var t1 = DateTime.Now;
            if (ConfigurationManager.RunningInContainer)
            {
                // Make sure this takes long enough for the orchestrator to think it's stable (20s?)
                Thread.Sleep(Math.Max(20000 - Convert.ToInt32((t1 - t0).TotalMilliseconds), 0));
            }
        }

        private static void MigrateUserDatabase(ILoggerFactory loggerFactory)
        {
            string connectionString = ConfigurationManager.Secrets["MOD_User_ConnectionString"];

            DbContextOptionsBuilder<UserContext> optionsBuilder = new DbContextOptionsBuilder<UserContext>();

            optionsBuilder
                .UseSqlServer(connectionString)
                .UseLoggerFactory(loggerFactory)
                .EnableDetailedErrors()
                .EnableSensitiveDataLogging();

            var context = new UserContext(optionsBuilder.Options);
            Log.Information("--------------------------- Starting User Migration --------------------------");

            DateTime t0 = DateTime.Now;
            context.Database.Migrate();

            DateTime t1 = DateTime.Now;
            if (ConfigurationManager.RunningInContainer)
            {
                // Make sure this takes long enough for the orchestrator to think it's stable (20s?)
                Thread.Sleep(Math.Max(20000 - Convert.ToInt32((t1 - t0).TotalMilliseconds), 0));
            }
        }
    }
}
