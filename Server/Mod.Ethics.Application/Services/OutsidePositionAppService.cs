using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Interfaces;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Notifications.Domain.Services;
using Mod.Framework.Runtime.Security;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Entities;
using Mod.Framework.User.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security;

namespace Mod.Ethics.Application.Services
{
    public class OutsidePositionAppService : CrudAppService<OutsidePositionDto, OutsidePosition>, IOutsidePositionAppService
    {
        private readonly INotificationDomService NotificationService;
        private readonly ISettingsAppService SettingsService;
        private readonly IEmployeeAppService EmployeeAppService;
        private readonly IOutsidePositionAttachmentRepository AttachmentRepository;
        private readonly IApplicationRoles ApplicationRoles;
        private readonly IEmployeeRepository EmployeeRepository;

        public OutsidePositionAppService(IOutsidePositionRepository repository, IEmployeeAppService employeeAppService, IOutsidePositionAttachmentRepository attachmentRepository,
            IApplicationRoles applicationRoles, IEmployeeRepository employeeRepository, INotificationDomService notificationService, ISettingsAppService settingsService, 
            IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            NotificationService = notificationService;
            SettingsService = settingsService;
            EmployeeAppService = employeeAppService;
            AttachmentRepository = attachmentRepository;
            ApplicationRoles = applicationRoles;
            EmployeeRepository = employeeRepository;

            Permissions.PermissionFilter = position => 
                Session.Principal.IsInRole(Roles.EthicsAppAdmin) || Session.Principal.IsInRole(Roles.OGESupport) || 
                Session.Principal.IsInRole(Roles.OGEReviewer) || Session.Principal.IsInRole(Roles.FOIA) ||
                position.EmployeeUpn == Session.Principal.Upn || 
                (!string.IsNullOrEmpty(position.SupervisorUpn) && position.SupervisorUpn == Session.Principal.Upn);
        }

        public override OutsidePositionDto Get(int id)
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type OutsidePosition.");

            var entity = Repository.GetIncluding(id, this.Permissions.PermissionFilter, x => x.OutsidePositionAttachments, y => y.OutsidePositionStatuses);

            return SingleMap(entity);
        }

        public List<OutsidePositionDto> GetMyPositions()
        {
            return this.GetBy(x => x.EmployeeUpn == this.Session.Principal.Upn).ToList();
        }

        public List<OutsidePositionDto> GetByEmployee(string employeeUpn)
        {
            employeeUpn = string.IsNullOrEmpty(employeeUpn) ? "" : employeeUpn.ToLower();
            var positions = base.GetByIncluding(x => x.EmployeeUpn == employeeUpn || x.CreatedBy == employeeUpn, z => z.OutsidePositionStatuses, y => y.OutsidePositionAttachments);

            return positions.ToList();
        }

        protected override void OnBeforeCreate(CrudEventArgs<OutsidePositionDto, OutsidePosition> e)
        {
            UpdateStatus(e.Entity, OutsidePositionActions.SAVED, "", OutsidePositionStatuses.DRAFT);
        }

        protected override void OnCreated(CrudEventArgs<OutsidePositionDto, OutsidePosition> e)
        {
            var attachments = AttachmentRepository.GetAll(x => x.AttachedToGuid.ToString() == e.Dto.AttachmentGuid);

            if (e.Entity.OutsidePositionAttachments is null)
                e.Entity.OutsidePositionAttachments = new List<OutsidePositionAttachment>();

            attachments.ForEach(x => e.Entity.OutsidePositionAttachments.Add(x));

            e.Dto = SingleMap(Repository.Save(e.Entity));
        }

        protected override void OnBeforeUpdate(CrudEventArgs<OutsidePositionDto, OutsidePosition> e)
        {
            var dict = GetEmailData(e.Dto);
            var entity = e.Entity;
            if (entity.Status == OutsidePositionStatuses.AWAITING_MANAGER && entity.SupervisorUpn != e.Dto.SupervisorUpn)
            {
                // If we're awaiting manager and the manager is changed, send new notification
                // If a supervisor was selected, set to awaiting manager
                if (string.IsNullOrEmpty(e.Dto.SupervisorUpn))
                    UpdateStatus(entity, OutsidePositionActions.SAVED, "Manager Removed", OutsidePositionStatuses.AWAITING_ETHICS);

                var notification = NotificationService.CreateNotification((int)NotificationTypes.OutsidePositionSubmitted, "", dict, "");
                NotificationService.AddNotification(notification);
            }
        }

        protected override void OnUpdated(CrudEventArgs<OutsidePositionDto, OutsidePosition> e)
        {
            // just re-get dto
            e.Dto = Get(e.Dto.Id);
        }

        public OutsidePositionDto Approve(OutsidePositionDto dto)
        {
            var entity = Repository.Get(dto.Id);
            var dict = GetEmailData(dto);

            entity.Guidance = dto.Guidance;

            if (entity.Status == OutsidePositionStatuses.AWAITING_MANAGER)
            {
                UpdateStatus(entity, OutsidePositionActions.MANAGER_APPROVED, "", OutsidePositionStatuses.AWAITING_ETHICS);

                var notification = NotificationService.CreateNotification((int)NotificationTypes.OutsidePositionApproval, entity.EmployeeEmail, dict, "");
                NotificationService.AddNotification(notification);
            }
            else if (entity.Status == OutsidePositionStatuses.AWAITING_ETHICS)
            {
                UpdateStatus(entity, OutsidePositionActions.ETHICS_APPROVED, "", OutsidePositionStatuses.APPROVED);

                var notification = NotificationService.CreateNotification((int)NotificationTypes.OutsidePositionEthicsApproval, entity.EmployeeEmail, dict, "");
                NotificationService.AddNotification(notification);
            }

            entity = Repository.Save(entity);
            dto = SingleMap(entity);

            return dto;
        }

        private OutsidePositionDto SingleMap(OutsidePosition entity)
        {
            var dto = PostMap(MapToDto(entity));

            // get supervisor
            if (entity.SupervisorUpn != null)
                dto.Supervisor = EmployeeAppService.GetByUpn(entity.SupervisorUpn);

            var knownEmps = new List<EmployeeDto>();

            foreach (var statusDto in dto.OutsidePositionStatuses)
            {
                var emp = knownEmps.FirstOrDefault(x => x.Upn == statusDto.CreatedBy);

                if (emp == null && statusDto.CreatedBy != null)
                {
                    emp = EmployeeAppService.GetByUpn(statusDto.CreatedBy);
                    knownEmps.Add(emp);
                }

                if (emp != null)
                    statusDto.CreatedByName = emp.DisplayName;                
            }

            dto.OutsidePositionStatuses = dto.OutsidePositionStatuses.OrderByDescending(x => x.CreatedTime).ToList();

            return dto;
        }

        public OutsidePositionDto Cancel(OutsidePositionDto dto)
        {
            var entity = Repository.Get(dto.Id);

            UpdateStatus(entity, OutsidePositionActions.CANCELED, "", OutsidePositionStatuses.CANCELED);

            entity = Repository.Save(entity);
            dto = SingleMap(entity);

            return dto;
        }

        public OutsidePositionDto Disapprove(OutsidePositionDto dto)
        {
            var entity = Repository.Get(dto.Id);

            if (entity.Status == OutsidePositionStatuses.AWAITING_MANAGER)
            {
                UpdateStatus(entity, OutsidePositionActions.MANAGER_DISAPPROVED, dto.DisapproveReason, OutsidePositionStatuses.DISAPPROVED);
                UpdateStatus(dto, OutsidePositionActions.MANAGER_DISAPPROVED, dto.DisapproveReason, OutsidePositionStatuses.DISAPPROVED);
            }
            else if (entity.Status == OutsidePositionStatuses.AWAITING_ETHICS)
            {
                UpdateStatus(entity, OutsidePositionActions.ETHICS_DISAPPROVED, dto.DisapproveReason, OutsidePositionStatuses.DISAPPROVED);
                UpdateStatus(dto, OutsidePositionActions.ETHICS_DISAPPROVED, dto.DisapproveReason, OutsidePositionStatuses.DISAPPROVED);
            }

            var dict = GetEmailData(dto);

            var notification = NotificationService.CreateNotification((int)NotificationTypes.OutsidePositionDisapproved, entity.EmployeeEmail, dict, "");
            NotificationService.AddNotification(notification);
            
            entity = Repository.Save(entity);
            dto = SingleMap(entity);

            return dto;
        }

        public OutsidePositionDto Submit(OutsidePositionDto dto)
        {
            var valid = false;
            var entity = Repository.Get(dto.Id);

            // Double check validation
            valid = IsValid(entity);

            // If all valid, Update status
            if (valid)
            {
                entity.SubmittedDate = DateTime.Now;
                entity.EmployeeSignature = Session.Principal.DisplayName;

                // If a supervisor was selected, set to awaiting manager
                if (!string.IsNullOrEmpty(entity.SupervisorUpn))
                    UpdateStatus(entity, OutsidePositionActions.SUBMITTED, "", OutsidePositionStatuses.AWAITING_MANAGER);
                else
                    UpdateStatus(entity, OutsidePositionActions.SUBMITTED, "", OutsidePositionStatuses.AWAITING_ETHICS);

                // Save
                Repository.Save(entity);

                // Handle Notifications
                var dict = GetEmailData(dto);
                var toEmail = "";
                var notification = NotificationService.CreateNotification((int)NotificationTypes.OutsidePositionConfirmation, entity.EmployeeEmail, dict, "");
                NotificationService.AddNotification(notification);

                var supervisor = EmployeeAppService.GetByUpn(entity.SupervisorUpn);

                if (entity.Status == OutsidePositionStatuses.AWAITING_MANAGER && supervisor != null)
                {
                    // if the status is awaiting manager and we found that manager send to them.
                    toEmail = supervisor.EmailAddress;
                }
                else
                {
                    // e lse send to OGE Reviewer role
                    toEmail = GetEmailsForRole(Roles.OGEReviewer);
                }

                notification = NotificationService.CreateNotification((int)NotificationTypes.OutsidePositionSubmitted, toEmail, dict, "");
                NotificationService.AddNotification(notification);

                dto = SingleMap(entity);
            }
            else
            {
                // Throw invalid Exception
                throw new Exception("Cannot save Outside Position, record is invalid.");
            }

            return dto;
        }

        private string GetEmailsForRole(string role)
        {
            string[] roleGroups = ApplicationRoles.GetRoleGroups(role);
            List<Employee> usersInRole = EmployeeRepository.GetAllInGroups(roleGroups);

            string emailList = "";
            usersInRole.ForEach(x => emailList += x.EmailAddress + ",");
            _ = emailList.TrimEnd(',');

            return emailList;
        }

        private bool IsValid(OutsidePosition entity)
        {
            var invalid = false;

            // check all strings
            invalid |= string.IsNullOrEmpty(entity.EmployeeName);
            invalid |= string.IsNullOrEmpty(entity.EmployeeUpn);
            invalid |= string.IsNullOrEmpty(entity.EmployeeEmail);
            invalid |= string.IsNullOrEmpty(entity.Title);
            invalid |= string.IsNullOrEmpty(entity.FilerType);
            invalid |= string.IsNullOrEmpty(entity.DepartmentName);
            invalid |= string.IsNullOrEmpty(entity.Poc);
            invalid |= string.IsNullOrEmpty(entity.PocEmail);
            invalid |= string.IsNullOrEmpty(entity.PositionTitle);
            invalid |= string.IsNullOrEmpty(entity.PeriodsOfEmployment);
            invalid |= string.IsNullOrEmpty(entity.PhysicalLocation);
            invalid |= string.IsNullOrEmpty(entity.MethodOfCompensation);
            invalid |= string.IsNullOrEmpty(entity.Duties);
            
            // Conditionally requried.
            if (entity.IsLikeOfficialDuties.HasValue && entity.IsLikeOfficialDuties.Value)
                invalid |= string.IsNullOrEmpty(entity.RelationshipToDuties);

            // check other fields
            invalid |= entity.IsLikeOfficialDuties == null;
            invalid |= entity.RequiresAbsence == null;
            invalid |= entity.InvolveExpense == null;
            invalid |= entity.UseOfFacilities == null;
            invalid |= entity.RequireDutiesContract == null;
            invalid |= entity.RequiresDutiesFederal == null;
            invalid |= entity.InvolveOfficialTitle == null;
            invalid |= entity.InvolveDutiesSales == null;
            invalid |= entity.InvolveOrg == null;
            invalid |= entity.PocPhone == null;
            invalid |= entity.EmployeePhone == null;
            invalid |= entity.AnnualSalary == null;
            invalid |= entity.StartDate == null;

            return !invalid;
        }

        private Dictionary<string, string> GetEmailData(OutsidePositionDto dto)
        {
            var user = Session.Principal;
            var dict = new Dictionary<string, string>();
            var settings = SettingsService.Get();

            dict = SettingsService.AppendEmailData(dict, settings);
            var action = "";
            var comment = "";
            var manager = "";
            var disapprover = "";

            if (dto.OutsidePositionStatuses != null)
            {
                action = dto.OutsidePositionStatuses.OrderByDescending(x => x.CreatedTime).FirstOrDefault()?.Action ?? "";
                var dis = dto.OutsidePositionStatuses.FirstOrDefault(x => x.Status == OutsidePositionStatuses.DISAPPROVED);
                comment = dis?.Comment ?? "";
                disapprover = dis?.CreatedByName ?? "";

                manager = dto.OutsidePositionStatuses.FirstOrDefault(x => x.Action == OutsidePositionActions.MANAGER_APPROVED)?.CreatedByName;
            }

            dict.Add("Action", action);
            dict.Add("DisapprovedReason", comment);
            dict.Add("Employee", dto.EmployeeName);
            dict.Add("Guidance", dto.Guidance);
            dict.Add("Manager", manager);
            dict.Add("Disapprover", disapprover);

            dict.Add("EmployeePhone", FormatPhone(dto.EmployeePhone));
            dict.Add("EmployeeEmail", dto.EmployeeEmail);
            dict.Add("Title", dto.Title);
            dict.Add("Grade", dto.Grade);
            dict.Add("AnnualSalary", dto.AnnualSalary);
            dict.Add("FilerType", dto.FilerType);
            dict.Add("DepartmentName", dto.DepartmentName);
            dict.Add("Poc", dto.Poc);
            dict.Add("PocPhone", FormatPhone(dto.PocPhone));
            dict.Add("PocEmail", dto.PocEmail);
            dict.Add("PositionTitle", dto.PositionTitle);
            dict.Add("OrganizationName", dto.OrganizationName);
            dict.Add("PeriodsOfEmployment", dto.PeriodsOfEmployment);
            dict.Add("PhysicalLocation", dto.PhysicalLocation);
            dict.Add("IsPaid", GetYesNo(dto.IsPaid));
            dict.Add("MethodOfCompensation", dto.MethodOfCompensation);
            dict.Add("StartDate", Convert.ToDateTime(dto.StartDate).ToShortDateString());
            dict.Add("EndDate", Convert.ToDateTime(dto.EndDate).ToShortDateString());
            dict.Add("TypeOfWork", GetTypeOfWork(dto.TypeOfWork));
            dict.Add("Duties", dto.Duties);
            dict.Add("IsLikeOfficialDuties", GetYesNo(dto.IsLikeOfficialDuties));
            dict.Add("RelationshipToDuties", dto.RelationshipToDuties);
            dict.Add("RequiresAbsence", GetYesNo(dto.RequiresAbsence));
            dict.Add("InvolveExpense", GetYesNo(dto.InvolveExpense));
            dict.Add("UseOfFacilities", GetYesNo(dto.UseOfFacilities));
            dict.Add("RequireDutiesContract", GetYesNo(dto.RequireDutiesContract));
            dict.Add("RequiresDutiesFederal", GetYesNo(dto.RequiresDutiesFederal));
            dict.Add("InvolveOfficialTitle", GetYesNo(dto.InvolveOfficialTitle));
            dict.Add("InvolveDutiesSales", GetYesNo(dto.InvolveDutiesSales));
            dict.Add("InvolveOrg", GetYesNo(dto.InvolveOrg));
            dict.Add("AdditionalRemarks", dto.AdditionalRemarks);
            dict.Add("SubmittedDate", Convert.ToDateTime(dto.SubmittedDate).ToShortDateString()); 
            dict.Add("EthicsOfficial", dto.EthicsOfficial);
            
            return dict;
        }

        private string FormatPhone(long? phone)
        {
            var value = "";

            if (phone.HasValue)
            {
                value = string.Format("{0:(###) ###-####}", phone);
            }

            return value;
        }

        private string GetYesNo(bool? value)
        {
            return value.HasValue && value.Value ? "Yes" : "No";
        }

        private string GetTypeOfWork(int value)
        {
            var typeOfWork = "";

            if ((value & 1) == 1)
                typeOfWork += "Professional or Consultative Activity; ";
            if ((value & 2) == 2)
                typeOfWork += "Teaching, Speaking, Writing or Editing related to official duties; ";
            if ((value & 4) == 4)
                typeOfWork += "Board Service; ";
            if ((value & 8) == 8)
                typeOfWork += "Volunteer; ";
            if ((value & 16) == 16)
                typeOfWork += "Expert Witness; ";
            if ((value & 32) == 32)
                typeOfWork += "Self-Employment; ";
            if ((value & 64) == 64)
                typeOfWork += "Salaried or Hourly Employee; ";
            if ((value & 128) == 128)
                typeOfWork += "Other; ";

            typeOfWork = typeOfWork.TrimEnd(';', ' ');

            return typeOfWork;
        }

        private void UpdateStatus(OutsidePosition entity, string action, string comment, string status)
        {
            if (entity.OutsidePositionStatuses is null)
                entity.OutsidePositionStatuses = new List<OutsidePositionStatus>();

            entity.Status = status;
            entity.OutsidePositionStatuses.Add(new OutsidePositionStatus() { Status = status, Comment = comment, Action = action });
        }

        private void UpdateStatus(OutsidePositionDto dto, string action, string comment, string status)
        {
            if (dto.OutsidePositionStatuses is null)
                dto.OutsidePositionStatuses = new List<OutsidePositionStatusDto>();

            dto.Status = status;
            dto.OutsidePositionStatuses.Add(new OutsidePositionStatusDto() { Status = status, Comment = comment, Action = action, CreatedTime = DateTime.Now, CreatedBy = Session.Principal.DisplayName });
        }

        public OutsidePositionSummary GetSummary()
        {
            var summary = new OutsidePositionSummary();

            var filterStartDate = DateTime.Now;
            var filterEndDate = DateTime.Now.AddDays(7);

            filterStartDate = new DateTime(filterStartDate.Year, filterStartDate.Month, filterStartDate.Day);
            filterEndDate = new DateTime(filterEndDate.Year, filterEndDate.Month, filterEndDate.Day, 23, 59, 59);

            Expression<Func<OutsidePosition, bool>> filter = x => x.Status.Contains(OutsidePositionStatuses.AWAITING_MANAGER);
            filter = filter.And(this.Permissions.PermissionFilter);

            var awaitingManager = Repository.GetAll(filter);

            filter = x => x.Status.Contains(OutsidePositionStatuses.AWAITING_ETHICS);
            filter = filter.And(this.Permissions.PermissionFilter);

            var awaitingEthics = Repository.GetAll(filter);

            summary.AwaitingManager = awaitingManager.Count();
            summary.AwaitingEthics = awaitingEthics.Count();

            //var soon = awaitingManager.Where(x => x.StartDate <= filterEndDate && x.StartDate >= filterStartDate);
            //soon.Union(awaitingEthics.Where(x => x.StartDate <= filterEndDate && x.StartDate >= filterStartDate));

            filter = x =>
                (x.Status == OutsidePositionStatuses.AWAITING_MANAGER && x.SupervisorUpn == Session.Principal.Upn) ||
                (x.Status == OutsidePositionStatuses.AWAITING_ETHICS && (Session.Principal.IsInRole(Roles.OGESupport) || Session.Principal.IsInRole(Roles.EthicsAppAdmin)));
            filter = filter.And(this.Permissions.PermissionFilter);

            summary.AssignedToMe = Repository.GetAll(filter).Count();

            return summary;
        }
    }
}
