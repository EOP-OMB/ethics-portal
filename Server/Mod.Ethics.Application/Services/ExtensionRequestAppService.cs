using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Notifications.Domain.Entities;
using Mod.Framework.Notifications.Domain.Services;
using Mod.Framework.Runtime.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;

namespace Mod.Ethics.Application.Services
{
    public class ExtensionRequestAppService : CrudAppService<ExtensionRequestDto, OgeForm450ExtensionRequest>, IExtensionRequestAppService
    {
        private readonly ISettingsAppService SettingsService;
        private readonly INotificationDomService NotificationService;
        private readonly IOgeForm450AppService FormService;

        private List<Notification> _pendingEmails;

        public ExtensionRequestAppService(IOgeForm450ExtensionRequestRepository repository, ISettingsAppService settingsService, IOgeForm450AppService formService, INotificationDomService notificationService, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            NotificationService = notificationService;
            SettingsService = settingsService;
            FormService = formService;

            var isAdminOrReviewer = Session.Principal.IsInRole(Roles.OGEReviewer) || Session.Principal.IsInRole(Roles.EthicsAppAdmin) || Session.Principal.IsInRole(Roles.OGESupport);

            //Permissions.CanRead = isAdminOrReviewer;
//            Permissions.CanUpdate = isAdminOrReviewer;  
            Permissions.CanCreate = true; // check done in OnBeforeCreate
            Permissions.CanDelete = false;

            Permissions.PermissionFilter = x => x.OgeForm450.FilerUpn.ToLower() == session.UserId.ToLower() || isAdminOrReviewer;
        }

        protected override void OnBeforeCreate(CrudEventArgs<ExtensionRequestDto, OgeForm450ExtensionRequest> e)
        {
            var form = FormService.Get(e.Dto.OgeForm450Id);
            _pendingEmails = new List<Notification>();

            if (!(form.FormStatus == OgeForm450Statuses.NOT_STARTED || form.FormStatus == OgeForm450Statuses.DRAFT || form.FormStatus == OgeForm450Statuses.MISSING_INFORMATION))
            {
                e.Msg = "Cannot make a request for a form that has been submitted or certified or cancelled";
                e.Cancel = true;
                return;
            }

            // ensure 90 day rule
            if (form.DaysExtended + e.Dto.DaysRequested > 90)
            {
                e.Msg = "Cannot make a request for more than 90 days";
                e.Cancel = true;
                return;
            }

            if (e.Dto.DaysRequested == 0)
            {
                e.Msg = "Must request at least one day";
                e.Cancel = true;
                return;
            }

            if (e.Dto.Reason == "")
            {
                e.Msg = "Must provide a reason for extension.";
                e.Cancel = true;
                return;
            }

            var data = GetEmailData(e.Dto);

            e.Entity.Status = ExtensionRequestStatuses.PENDING;
            e.Entity.ExtensionDate = Convert.ToDateTime(form.DueDate).AddDays(e.Dto.DaysRequested);

            var notification = NotificationService.CreateNotification((int)NotificationTypes.ExtensionRecieved, Session.Principal.EmailAddress, data, "");
            _pendingEmails.Add(notification);

            notification = NotificationService.CreateNotification((int)NotificationTypes.ExtensionRequest, "", data, "");
            _pendingEmails.Add(notification);
        }

        protected override void OnCreated(CrudEventArgs<ExtensionRequestDto, OgeForm450ExtensionRequest> e)
        {
            SendNotifications();
        }

        protected override void OnBeforeUpdate(CrudEventArgs<ExtensionRequestDto, OgeForm450ExtensionRequest> e)
        {
            _pendingEmails = new List<Notification>();

            if (e.Entity.Status == ExtensionRequestStatuses.PENDING && e.Dto.Status != ExtensionRequestStatuses.CANCELED && e.Dto.Status != ExtensionRequestStatuses.PENDING)
            {
                var data = GetEmailData(e.Dto);

                var notification = NotificationService.CreateNotification((int)NotificationTypes.ExtensionDecision, "", data, "");
                _pendingEmails.Add(notification);
            }
        }

        protected override void OnUpdated(CrudEventArgs<ExtensionRequestDto, OgeForm450ExtensionRequest> e)
        {
            if (e.Entity.Status == ExtensionRequestStatuses.APPROVED)
            {
                FormService.Extend(e.Dto);
            }

            SendNotifications();
        }

        public override IEnumerable<ExtensionRequestDto> GetAll()
        {
            return GetAllIncluding(x => x.OgeForm450).OrderBy(x => x.FilerName).ToList();
        }

        // Id here is the Form ID not the Extension Id
        public override ExtensionRequestDto Get(int id)
        {
            // get form by ID
            var form = FormService.Get(id);

            ExtensionRequestDto extension = null;

            var pendingExtensions = GetBy(x => x.OgeForm450.FilerUpn == form.Filer && x.Status == ExtensionRequestStatuses.PENDING);
            if (pendingExtensions.Count() == 0)
            {
                // If no pending extension for form, create a new extension
                extension = new ExtensionRequestDto
                {
                    OgeForm450Id = id,
                    DaysRequested = 0
                };
            }
            else
            {
                extension = pendingExtensions.First();
            }

            return extension;
        }

        public List<ExtensionRequestDto> GetPending()
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Not Authorized.");

            return GetByIncluding(x => x.Status == ExtensionRequestStatuses.PENDING, y => y.OgeForm450).ToList();
        }

        public bool HasPending(string upn)
        {
            return GetBy(x => x.OgeForm450.FilerUpn == upn && x.Status == ExtensionRequestStatuses.PENDING).Count() > 0;
        }

        private void SendNotifications()
        {
            foreach (Notification n in _pendingEmails)
            {
                NotificationService.AddNotification(n);
            }
        }

        public Dictionary<string, string> GetEmailData(ExtensionRequestDto dto)
        {
            var settings = SettingsService.Get();
            var dict = new Dictionary<string, string>();
            var user = Session.Principal;

            dict = SettingsService.AppendEmailData(dict, settings);

            dict.Add("User", user.DisplayName);
            dict.Add("Email", user.EmailAddress);

            dict.Add("Status", dto.Status);
            dict.Add("DaysRequested", dto.DaysRequested.ToString());
            dict.Add("Reason", dto.Reason);
            dict.Add("ReviewerComments", dto.ReviewerComments);

            return dict;
        }

        public Dictionary<string, string> GetEmailFieldsDef(Dictionary<string, string> dict)
        {
            dict.Add("[User]", "The Display Name of the filer.");
            dict.Add("[Email]", "The filer's email address.");
            dict.Add("[Filer]", "The Employees Name field from the OGE Form 450");
            dict.Add("[ReviewerNote]", "The Comments Of Reviewing Official from the OGE Form 450");
            dict.Add("[RejectionNotes]", "Notes left by reviewer when Rejecting an OGE Form 450");
            dict.Add("[DueDate]", "The Due Date of the filer's OGE Form 450");

            return dict;
        }
    }
}
