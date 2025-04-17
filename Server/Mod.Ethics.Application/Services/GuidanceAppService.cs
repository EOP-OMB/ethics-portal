using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Notifications.Domain.Services;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Interfaces;
using Mod.Framework.User.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Security;

namespace Mod.Ethics.Application.Services
{
    public class GuidanceAppService : CrudAppService<GuidanceDto, Guidance>, IGuidanceAppService
    {
        private readonly IEmployeeListAppService EmployeeListAppService;
        private readonly IEmployeeAppService EmployeeAppService;
        private readonly INotificationDomService NotificationService;
        private readonly ISettingsAppService SettingsAppService;
        private readonly IGuidanceAttachmentRepository AttachmentRepository;

        public GuidanceAppService(IGuidanceRepository repository, ISettingsAppService settingsService, IGuidanceAttachmentRepository attachmentRepository, INotificationDomService notificationService, IEmployeeAppService employeeService, IEmployeeListAppService employeeListAppService, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            EmployeeListAppService = employeeListAppService;
            EmployeeAppService = employeeService;
            NotificationService = notificationService;
            SettingsAppService = settingsService;
            AttachmentRepository = attachmentRepository;

            this.Permissions.CanCreate = this.Session.Principal.IsInRole(Roles.EthicsAppAdmin);
            this.Permissions.CanUpdate = this.Session.Principal.IsInRole(Roles.EthicsAppAdmin);

            var canRead = Session.Principal.IsInRole(Roles.EthicsAppAdmin) || Session.Principal.IsInRole(Roles.OGEReviewer) || 
                          Session.Principal.IsInRole(Roles.OGESupport) || Session.Principal.IsInRole(Roles.FOIA);

            this.Permissions.PermissionFilter = (x => x.IsShared || canRead);
        }

        public override GuidanceDto Get(int id)
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(Guidance).Name);

            var entity = Repository.GetIncluding(id, y => y.Attachments);

            var guidance = PostMap(MapToDto(entity));

            guidance.Employee = EmployeeAppService.GetByUpn(guidance.EmployeeUpn);

            return guidance;
        }

        protected override GuidanceDto PostMap(GuidanceDto dto)
        {
            dto.HasAttachments = dto.Attachments.Any();

            return dto;
        }

        public override IEnumerable<GuidanceDto> GetAll()
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(Guidance).Name);

            var guidances = Repository.GetAllIncluding(this.Permissions.PermissionFilter, x => x.Attachments);
            var employees = EmployeeListAppService.GetAllNoFilter();

            var dtos = from g in guidances
                       join emp in employees
                       on g.EmployeeUpn.ToLower() equals emp.Upn.ToLower()
                       join creator in employees
                       on g.CreatedBy.ToLower() equals creator.Upn.ToLower()
                       select new GuidanceDto() {
                           Id = g.Id,
                           EmployeeUpn = g.EmployeeUpn.ToLower(),
                           GuidanceType = g.GuidanceType,
                           Subject = g.Subject,
                           Text = g.Text,
                           EmployeeName = emp?.DisplayName,
                           FilerType = emp?.FilerType,
                           CreatedBy = creator?.DisplayName,
                           CreatedTime = g.CreatedTime,
                           ModifiedTime = g.ModifiedTime,
                           Summary = g.Summary,
                           DateOfGuidance = g.DateOfGuidance,
                           Guid = g.Guid,
                           HasAttachments = g.Attachments?.Count > 0
                       };

            return dtos;
        }

        public IEnumerable<GuidanceDto> GetByEmployee(string employeeUpn)
        {
            var guidances = base.GetByIncluding(x => x.EmployeeUpn.ToLower() == employeeUpn.ToLower(), y => y.Attachments);

            return guidances;
        }

        protected override void OnCreated(CrudEventArgs<GuidanceDto, Guidance> e)
        {
            SaveAttachments(e);
        }

        private void SaveAttachments(CrudEventArgs<GuidanceDto, Guidance> e)
        {
            var attachments = AttachmentRepository.GetAll(x => x.AttachedToGuid == e.Dto.Guid);

            if (e.Entity.Attachments is null)
                e.Entity.Attachments = new List<GuidanceAttachment>();

            attachments.ForEach(x => e.Entity.Attachments.Add(x));

            Repository.Save(e.Entity);
        }

        public override GuidanceDto Create(GuidanceDto dto)
        {
            dto.EmployeeName = dto.Employee.DisplayName;
            dto.FilerType = dto.Employee.FilerType;
            dto.GivenBy = this.Session.Principal.DisplayName;
            var retDto = base.Create(dto);

            SendNotification(retDto);

            return retDto;
        }

        private void SendNotification(GuidanceDto dto)
        {
            var dict = GetEmailData(dto);
            var emp = EmployeeAppService.GetByUpn(dto.EmployeeUpn);

            var recipient = dto.NotifyEmployee ? emp.EmailAddress : "";

            if (string.IsNullOrEmpty(recipient))
            {
                // If no recipient, use the Cc, if no Cc use the user adding the notification
                recipient = dict["Cc"] != null ? dict["Cc"] : Session.Principal.EmailAddress;
            }

            var notification = NotificationService.CreateNotification((int)NotificationTypes.GuidanceGiven, recipient, dict, "");
            NotificationService.AddNotification(notification);
        }

        public override GuidanceDto Update(GuidanceDto dto)
        {
            dto.EmployeeName = dto.Employee.DisplayName;
            dto.FilerType = dto.Employee.FilerType;
            dto.GivenBy = this.Session.Principal.DisplayName;
            var retDto = base.Update(dto);

            SendNotification(retDto);

            return retDto;
        }

        protected override void OnUpdated(CrudEventArgs<GuidanceDto, Guidance> e)
        {
            SaveAttachments(e);
        }

        public Dictionary<string, string> GetEmailData(GuidanceDto dto)
        {
            var user = Session.Principal;
            var dict = new Dictionary<string, string>();
            var settings = SettingsAppService.Get();

            dict = SettingsAppService.AppendEmailData(dict, settings);

            dict.Add("User", user.DisplayName);
            dict.Add("Email", user.EmailAddress);

            dict.Add("Employee", dto.EmployeeName);
            dict.Add("FilerType", dto.FilerType);
            dict.Add("GuidanceType", dto.GuidanceType);
            dict.Add("Subject", dto.Subject);
            dict.Add("Date", dto.CreatedTime.ToShortDateString());
            dict.Add("Guidance", dto.Text);

            return dict;
        }

        public Dictionary<string, string> GetEmailFieldsDef(Dictionary<string, string> dict)
        {
            dict.Add("[User]", "The Display Name of the filer.");
            dict.Add("[Email]", "The filer's email address.");
            dict.Add("[Employee]", "The Name of the Employee to whom guidance was given");
            dict.Add("[FilerType]", "The Employee's Filing Type");
            dict.Add("[GuidanceType]", "The Type of Guidance");
            dict.Add("[Subject]", "The Subject matter of the guidance");
            dict.Add("[Date]", "The Date the guidance was given");
            dict.Add("[Guidance]", "The guidance given");

            return dict;
        }
    }
}
