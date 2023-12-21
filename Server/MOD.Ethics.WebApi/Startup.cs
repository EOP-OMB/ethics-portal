using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Infrastructure.Dependency;
using Mod.Framework.Runtime.Security;
using Mod.Framework.WebApi.Extensions;
using System;
using System.Configuration;

namespace Mod.Ethics.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            var applicationRoles = new ApplicationRoles();

            var groups = Environment.GetEnvironmentVariable("MOD_Ethics_SystemAdminGroups").Split(';', ',');
            //var groups = new List<string>().ToArray();
            applicationRoles.Roles.Add(new Role(Roles.EthicsAppAdmin, groups));

            groups = Environment.GetEnvironmentVariable("MOD_Ethics_ReviewerGroups").Split(';', ',');
            applicationRoles.Roles.Add(new Role(Roles.OGEReviewer, groups));

            groups = Environment.GetEnvironmentVariable("MOD_Ethics_SupportGroups").Split(';', ',');
            applicationRoles.Roles.Add(new Role(Roles.OGESupport, groups));

            groups = Environment.GetEnvironmentVariable("MOD_Ethics_EventReviewerGroups").Split(';', ',');
            applicationRoles.Roles.Add(new Role(Roles.EventReviewer, groups));

            services.AddModAspNetCore(options =>
            {
                options.ApplicationRoles = applicationRoles;
            });
            IdentityModelEventSource.ShowPII = true; //Add this line

            services.Configure<FormOptions>(o => {
                o.MultipartBodyLengthLimit = 1024 * 1024 * 1024;
            });

            services.AddEthics();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            if (Framework.Configuration.ConfigurationManager.Secrets.Exists("APP_BASE_PATH"))
            {
                _ = app.UsePathBase(Framework.Configuration.ConfigurationManager.Secrets["APP_BASE_PATH"]);
            }


            app.UseModAspNetCore();
        }
    }
}
