using Microsoft.Extensions.DependencyInjection;
using AutoMapper;

using Mod.Framework.Serilog;

using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Interfaces;
using Mod.Ethics.Infrastructure.EfCore;
using Microsoft.EntityFrameworkCore;
using Mod.Framework.Configuration;
using Mod.Framework.Dependency;
using Mod.Framework.User.Extensions;
using Mod.Framework.Notifications.Extensions;
using Mod.Framework.Notifications.Domain.Interfaces;
using Mod.Ethics.Application.Mapping;
using Mod.Ethics.Infrastructure.EfCore.Repositories;
using Mod.Framework.Attachments.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Attachments.Dtos;

namespace Mod.Ethics.Infrastructure.Dependency
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEthics(this IServiceCollection services)
        {
            // Simplify and add to framework?
            services.AddDbContext<EthicsContext>(options =>
            {
                options
                      .UseSqlServer(ConfigurationManager.Secrets["Mod_Ethics_ConnectionString"])
                      .EnableDetailedErrors();
            });

            services.AddModNotifications(options =>
            {
                options.PollingFrequency = 60000;
            });

            services.AddModUsers();

            services.AddSerilogServices();

            services.AddModFramework();

            services.AddAutoMapper(typeof(OgeForm450Profile).Assembly);

            services.AddTransient<IOgeForm450AppService, OgeForm450AppService>();
            services.AddTransient<IOgeForm450Repository, OgeForm450Repository>();

            services.AddTransient<IEmployeeAppService, EmployeeAppService>();

            services.AddTransient<IEmployeeListAppService, EmployeeListAppService>();

            services.AddTransient<IEthicsFormAppService, EthicsFormAppService>();
            services.AddTransient<IEthicsFormRepository, EthicsFormRepository>();

            services.AddTransient<IEthicsTeamAppService, EthicsTeamAppService>();
            services.AddTransient<IEthicsTeamRepository, EthicsTeamRepository>();

            services.AddTransient<IHelpfulLinkAppService, HelpfulLinkAppService>();
            services.AddTransient<IHelpfulLinkRepository, HelpfulLinkRepository>();

            services.AddTransient<IEventRequestAppService, EventRequestAppService>();
            services.AddTransient<IEventRequestRepository, EventRequestRepository>();

            services.AddTransient<ITrainingAppService, TrainingAppService>();
            services.AddTransient<ITrainingRepository, TrainingRepository>();

            services.AddTransient<ISettingsAppService, SettingsAppService>();
            services.AddTransient<ISettingsRepository, SettingsRepository>();

            services.AddTransient<IExtensionRequestAppService, ExtensionRequestAppService>();
            services.AddTransient<IOgeForm450ExtensionRequestRepository, OgeForm450ExtensionRequestRepository>();

            services.AddTransient<INotificationTemplateRepository, NotificationTemplateRepository>();
            services.AddTransient<INotificationRepository, NotificationRepository>();

            services.AddTransient<IGuidanceRepository, GuidanceRepository>();
            services.AddTransient<IGuidanceAppService, GuidanceAppService>();

            services.AddTransient<IGuidanceSubjectRepository, GuidanceSubjectRepository>();
            services.AddTransient<IGuidanceSubjectAppService, GuidanceSubjectAppService>();

            services.AddTransient<IGuidanceTypeRepository, GuidanceTypeRepository>();
            services.AddTransient<IGuidanceTypeAppService, GuidanceTypeAppService>();

            services.AddTransient<IGuidanceAttachmentRepository, GuidanceAttachmentRepository>();
            services.AddTransient<IGuidanceAttachmentAppService, GuidanceAttachmentAppService>();

            services.AddTransient<IReportAppService, ReportAppService>();

            services.AddHostedService<EthicsNotificationService>();

            return services;
        }
    }
}
