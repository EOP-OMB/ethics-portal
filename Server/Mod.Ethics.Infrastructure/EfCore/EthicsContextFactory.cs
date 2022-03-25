using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Mod.Framework.Runtime.Session;
using System;

namespace Mod.Ethics.Infrastructure.EfCore
{
    public class EthicsContextFactory : IDesignTimeDbContextFactory<EthicsContext>
    {
        public EthicsContext CreateDbContext(string[] args)
        {
            var connectionString = Environment.GetEnvironmentVariable("MOD_Ethics_ConnectionString");

            var optionsBuilder = new DbContextOptionsBuilder<EthicsContext>();
            optionsBuilder.UseSqlServer(connectionString);

            var context = new EthicsContext(optionsBuilder.Options, NullModSession.Instance);

            return context;
        }
    }
}
