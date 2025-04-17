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
using Mod.Framework.Notifications;
using Mod.Ethics.Application.Interfaces;

namespace Mod.Ethics.Infrastructure.Dependency
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEthics(this IServiceCollection services)
        {
            var connectionString = ConfigurationManager.Secrets["MOD_Ethics_ConnectionString"];
            // Simplify and add to framework?
            services.AddDbContext<EthicsContext>(options =>
            {
                options
                      .UseSqlServer(connectionString)
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

            services.AddTransient<IPortalAppService, PortalAppService>();

            services.AddTransient<IReportAppService, ReportAppService>();

            services.AddTransient<EthicsNotificationTemplateAppService, EthicsNotificationTemplateAppService>();
            services.AddTransient<EventRequestTableAppService, EventRequestTableAppService>();
            services.AddTransient<OgeForm450TableAppService, OgeForm450TableAppService>();
            services.AddTransient<ExtensionRequestTableAppService, ExtensionRequestTableAppService>();

            services.AddTransient<IEventRequestAttachmentRepository, EventRequestAttachmentRepository>();
            services.AddTransient<IEventRequestAttachmentAppService, EventRequestAttachmentAppService>();

            services.AddTransient<IOutsidePositionAppService, OutsidePositionAppService>();
            services.AddTransient<IOutsidePositionRepository, OutsidePositionRepository>();
            services.AddTransient<IOutsidePositionAttachmentRepository, OutsidePositionAttachmentRepository>();
            services.AddTransient<IOutsidePositionAttachmentAppService, OutsidePositionAttachmentAppService>();

            services.AddTransient<TrainingTableAppService, TrainingTableAppService>();
            services.AddTransient<OutsidePositionTableAppService, OutsidePositionTableAppService>();

            services.AddTransient<IAttendeeAttachmentRepository, AttendeeAttachmentRepository>();
            services.AddTransient<IAttendeeAttachmentAppService, AttendeeAttachmentAppService>();

            services.AddHostedService<EthicsNotificationService>();
            services.AddTransient<GuidanceTableAppService, GuidanceTableAppService>();

            return services;
        }
    }
}
