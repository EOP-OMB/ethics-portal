using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Mod.Framework.Notifications.Domain.Entities;
using Mod.Framework.Notifications.Domain.Services;
using Mod.Framework.Notifications.Extensions;
using Mod.Framework.Notifications.Hosting;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using Mod.Ethics.Domain.Helpers;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.User.Interfaces;
using Mod.Framework.User.Entities;
using Mod.Framework.Domain.Repositories;

namespace Mod.Ethics.Application.Services
{
    public class EthicsNotificationService : NotificationBackgroundService, INotificationBackgroundService, IEthicsNotificationService
    {
        private IOgeForm450Repository FormRepository;
        private INotificationDomService NotificationService;
        private ISettingsAppService SettingsService;
        private IEmployeeRepository EmployeeRepository;
        private IEmployeeAppService EmployeeAppService;
        private ITrainingAppService TrainingAppService;

        protected override string FromEmailDisplayName { get => "Ethics Manager"; set => throw new NotImplementedException(); }

        public EthicsNotificationService(IOptions<ModNotificationOptions> options, ILogger<INotificationBackgroundService> logger, IServiceScopeFactory serviceScopeFactory) : base(options, logger, serviceScopeFactory)
        {
        }

        protected override void RegisterScopedServices(IServiceScope scope)
        {
            FormRepository = scope.ServiceProvider.GetRequiredService<IOgeForm450Repository>();
            NotificationService = scope.ServiceProvider.GetRequiredService<INotificationDomService>();
            SettingsService = scope.ServiceProvider.GetRequiredService<ISettingsAppService>();
            EmployeeRepository = scope.ServiceProvider.GetRequiredService<IEmployeeRepository>();
            EmployeeAppService = scope.ServiceProvider.GetRequiredService<IEmployeeAppService>();
            TrainingAppService = scope.ServiceProvider.GetRequiredService<ITrainingAppService>();
        }

        protected override void GenerateNotificationForTemplate(NotificationTemplate template)
        {
            //try
            //{
            switch (template.Type)
            {
                case (int)NotificationTypes.FormDueIn3Days:
                    GenerateFormDueInDaysNotifications(template, 3);
                    break;
                case (int)NotificationTypes.FormDueIn7Days:
                    GenerateFormDueInDaysNotifications(template, 7);
                    break;
                case (int)NotificationTypes.EmployeeSync:
                    GenerateEmployeeSyncNotification(template);
                    break;
                case (int)NotificationTypes.FormOverdue:
                    GenerateFormOverdueNotification(template);
                    break;
            }
            //}
            //catch (Exception ex)
            //{

            //}
        }

        private void GenerateFormOverdueNotification(NotificationTemplate template)
        {
            // Send notification after 3 days being overdue.
            // Send again each  week.
            var allOverdueForms = FormRepository.Query().Where(x => x.DueDate <= DateTime.Now.AddDays(-3) && (x.FormStatus == OgeForm450Statuses.NOT_STARTED || x.FormStatus == OgeForm450Statuses.DRAFT || x.FormStatus == OgeForm450Statuses.MISSING_INFORMATION)).ToList();
            var overdueForms = new List<OgeForm450>();
            var today = DateTime.Now.Date;

            foreach (var form in allOverdueForms)
            {
                var dueDate = form.DueDate;
                var days = new TimeSpan(DateTime.Now.Date.Ticks - form.DueDate.Date.Ticks).Days - 3;

                if (days % 7 == 0)
                    overdueForms.Add(form);
            }

            var dict = new Dictionary<string, string>();
            var settings = SettingsService.Get();

            dict = SettingsService.AppendEmailData(dict, settings);

            foreach (OgeForm450 form in overdueForms)
            {
                var user = EmployeeRepository.GetAll(x => x.Upn.ToLower() == form.FilerUpn.ToLower()).FirstOrDefault();
                
                if (user != null)
                {
                    var notification = NotificationService.CreateNotification(template.Type, user.EmailAddress, dict, user.ReportsTo?.EmailAddress);
                    NotificationService.AddNotification(notification);
                }
            }
        }

        private void GenerateEmployeeSyncNotification(NotificationTemplate template)
        {
            var dict = new Dictionary<string, string>();

            if (EmployeeAppService.Sync() > 0)
            {
                var notification = NotificationService.CreateNotification(template.Type, template.RecipientGroup, dict, "");
                NotificationService.AddNotification(notification);
            }

            // Sync Training Status
            var employees = EmployeeRepository.GetAllNoFilter();
            TrainingAppService.SyncEmployeeStatus(employees);

            //if (EmployeeAppService.CountNoFilerTypes() > 0)
            //{
            //    var notification = NotificationService.CreateNotification((int)NotificationTypes.SyncFailed, "steven_b_kuennen@omb.eop.gov", dict);
            //    NotificationService.AddNotification(notification);
            //}
        }

        private void GenerateFormDueInDaysNotifications(NotificationTemplate template, int days)
        {
            var dueForms = FormRepository.Query().Where(x => x.DueDate.Date == DateTime.Now.AddDays(days).Date && (x.FormStatus == OgeForm450Statuses.NOT_STARTED || x.FormStatus == OgeForm450Statuses.DRAFT || x.FormStatus == OgeForm450Statuses.MISSING_INFORMATION)).ToList();
            var dict = new Dictionary<string, string>();
            var settings = SettingsService.Get();

            dict = SettingsService.AppendEmailData(dict, settings);

            foreach (OgeForm450 form in dueForms)
            {
                var user = EmployeeRepository.GetAll(x => x.Upn.ToLower() == form.FilerUpn.ToLower()).FirstOrDefault();

                if (user != null)
                {
                    var notification = NotificationService.CreateNotification(template.Type, user.EmailAddress, dict, "");
                    NotificationService.AddNotification(notification);
                }
            }
        }
    }
}
