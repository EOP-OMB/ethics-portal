using Microsoft.Extensions.Logging;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Entities;
using Mod.Framework.User.Interfaces;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using Mod.Ethics.Domain.Enumerations;
using Mod.Framework.Notifications.Domain.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Services
{
    public class EmployeeAppService : EmployeeAppServiceBase<EmployeeDto>, IEmployeeAppService
    {
        private readonly INotificationTemplateRepository NotificationTemplateRepository;
        private readonly IOgeForm450AppService FormService;

        public EmployeeAppService(IEmployeeRepository repository, ISettingsAppService settingsService, IOgeForm450AppService formService, INotificationTemplateRepository notificationTemplateRepo, IOgeForm450Repository formRepository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, settingsService, formRepository, objectMapper, logger, session)
        {

            this.NotificationTemplateRepository = notificationTemplateRepo;
            this.FormService = formService;
            Permissions.CanUpdate = 
                    Session.Principal == null || 
                    Session.Principal.IsInRole(Roles.EthicsAppAdmin) || 
                    Session.Principal.IsInRole(Roles.OGESupport);
        }

        public override List<EmployeeDto> GetAll()
        {
            throw new NotSupportedException();
        }

        public override EmployeeDto Create(EmployeeDto dto)
        {
            throw new NotSupportedException();
        }

        public override void Delete(EmployeeDto dto)
        {
            throw new NotSupportedException();
        }

        public override EmployeeDto Update(EmployeeDto dto)
        {
            if (!Permissions.CanUpdate)
            {
                throw new SecurityException("Cannot Update Employee, insufficient access.");
            }

            var entity = Repository.GetIncluding(dto.Id, x => x.EmployeeAttributes);

            entity.SetAttributeValue(EmployeeAttributes.AppointmentDate, dto.AppointmentDate);
            entity.SetAttributeValue(EmployeeAttributes.EthicsFilerType, dto.FilerType);
            entity.SetAttributeValue(EmployeeAttributes.EmployeeStatus, dto.EmployeeStatus);
            entity.SetAttributeValue(EmployeeAttributes.EthicsReportingStatus, dto.ReportingStatus);
            entity.SetAttributeValue(EmployeeAttributes.EmployeeType, dto.Type);
            entity.SetAttributeValue(EmployeeAttributes.EmployeeSubtype, dto.Subtype);
            entity.SetAttributeValue(EmployeeAttributes.AppointmentDate, dto.AppointmentDate);

            if (entity.EmployeeAttributes == null)
                entity.EmployeeAttributes = new List<EmployeeAttribute>();

            if (dto.GenerateForm && !string.IsNullOrEmpty(dto.ReportingStatus))
            {
                CreateFormForEmployee(dto);
            }

            entity = Repository.Update(entity);

            return PostMap(MapToDto(entity));
        }

        public void CreateFormForEmployee(EmployeeDto dto, DateTime? dueDate = null)
        {
            var previousForm = FormRepository.GetLatestForm(dto.Upn);

            if (dueDate == null)
                dueDate = Convert.ToDateTime(dto.DueDate);

            FormService.GenerateNewForm(dto, dueDate.Value, previousForm);
        }

        protected override void GetNotificationText(EmployeeDto dto)
        {
            var notifications = NotificationTemplateRepository.GetAll();

            var annualNotification = notifications.Single(x => x.Type == (int)NotificationTypes.FormNewAnnual);
            dto.AnnualEmailText = annualNotification.Body;

            var newEntrantNotification = notifications.Single(x => x.Type == (int)NotificationTypes.FormNewEntrant);
            dto.NewEntrantEmailText = newEntrantNotification.Body;
        }

        public string GetProfileImage(int id)
        {
            var emp = Repository.GetNoFilter(id);

            return emp.GetAttribute("ProfileImage")?.Value;
        }

        public override EmployeeDto Get(int id)
        {
            var employee = Repository.GetNoFilter(id);

            if (employee.Upn.ToLower() == this.Session.Principal.Upn.ToLower() || this.Session.Principal.IsInRole(Roles.EventReviewer) || this.Session.Principal.IsInRole(Roles.OGEReviewer) || this.Session.Principal.IsInRole(Roles.EthicsAppAdmin) || this.Session.Principal.IsInRole(Roles.OGESupport) || this.Session.Principal.IsInRole(Roles.FOIA))
            {
                return PostMap(MapToDto(employee));
            }
            else
                return new EmployeeDto();
        }


        public EmployeeDto GetByUpn(string upn)
        {
            var employee = Repository.GetByUpn(upn);

            if (employee != null)
            {
                return PostMap(MapToDto(employee));
            }
            else
                return null;
        }

        public int Sync()
        {
            var settings = this.SettingsAppService.Get();
            var syncDate = DateTime.Now;
            var employees = Repository.GetAllNoFilter(x =>
                (x.Type != "CONT") &&
                (
                    x.Inactive && x.InactiveDate > settings.LastEmployeeSyncDate ||
                    x.CreatedTime > settings.LastEmployeeSyncDate ||
                    (
                        !x.EmployeeAttributes.Any(ea => ea.Attribute == EmployeeAttributes.EthicsFilerType) &&
                        x.Inactive == false
                    )
                ));
            var updates = 0;

            foreach (Employee emp in employees)
            {
                updates = SyncEmployee(updates, emp);
            }

            Repository.SaveChanges();
            settings.LastEmployeeSyncDate = syncDate;
            SettingsAppService.Update(settings);
            return updates;
        }

        private int SyncEmployee(int updates, Employee emp)
        {
            if (!emp.Inactive)
            {
                updates = SetEmployeeNotAssigned(updates, emp);
            }

            return updates;
        }

        private int SetEmployeeNotAssigned(int updates, Employee emp)
        {
            // A new employee was added, set their 450 status to not assigned if it hasn't already been set
            var filerType = emp.GetAttribute(EmployeeAttributes.EthicsFilerType);
            if (filerType == null || string.IsNullOrEmpty(filerType.Value))
            {
                emp.SetAttributeValue(EmployeeAttributes.EthicsFilerType, OgeForm450FilerTypes.NOT_ASSIGNED);
                updates++;
                Repository.SaveBulk(emp);
            }            

            return updates;
        }

        public EmployeeDto GetMyProfile()
        {
            if (Session.Principal != null)
            {
                var emp = GetByIncluding(x => x.Upn.ToLower() == Session.Principal.Upn.ToLower(), y => y.EmployeeAttributes, z => z.ReportsTo, d => d.Department).Single();

                return emp;
            }
            else
                return null;
        }

        public List<EmployeeDto> Search(string query)
        {
            //var results = GetBy(x => x.DisplayName.Contains(query));
            var results = GetByIncluding(x => x.DisplayName.Contains(query), y => y.EmployeeAttributes, z => z.ReportsTo);

            return results.ToList();
        }

        public int CountNoFilerTypes()
        {
            return Repository.GetAll(x => x.HasAttribute(EmployeeAttributes.EthicsFilerType) && x.GetAttribute(EmployeeAttributes.EthicsFilerType).Value != "").Count();
        }

        private SettingsDto StartAnnualFiling(SettingsDto settings)
        {
            var allForms = FormService.GetByIncluding(x => true, y => y.OgeForm450Statuses);
            var inProcessForms = allForms.Where(x => x.FormStatus != OgeForm450Statuses.CERTIFIED && x.FormStatus != OgeForm450Statuses.CANCELED && x.FormStatus != OgeForm450Statuses.DECLINED && !x.FormStatus.Contains(OgeForm450Statuses.EXPIRED)).ToList();

            // The filing year will move to settings.currentFilingYear + 1 
            settings.CurrentFilingYear += 1;
            settings.AnnualDueDate = settings.AnnualDueDate.AddYears(1);

            SettingsAppService.Update(settings);

            var recentForms = allForms.Where(x => x.DateOfEmployeeSignature >= settings.AnnualDueDate.AddDays(-105)).ToList();

            // All employees with a filer type of '450 Filer' who filed prior to Aptil 1st will receive a new form.
            // Any active form will stay active and prohibit a new Annual report from being created.
            // It is the discretion of the Admins whether to create a new form for them once their active one is certified
            // New forms will be a copy of the previous filing year's form if applicable
            var emps = base.GetAll().Where(x => x.Type != "CONT" && x.FilerType == OgeForm450FilerTypes.FORM_450_FILER && x.Inactive == false).ToList();

            foreach (EmployeeDto emp in emps)
            {
                try
                {
                    var openForm = inProcessForms.Where(x => x.Filer.ToLower() == emp.Upn.ToLower()).OrderByDescending(x => x.DueDate).FirstOrDefault();
                    var recentForm = recentForms.Where(x => x.Filer.ToLower() == emp.Upn.ToLower()).OrderByDescending(x => x.DueDate).FirstOrDefault();

                    if (openForm == null && recentForm == null)
                    {
                        if (emp.ReportingStatus != OgeForm450ReportingStatuses.ANNUAL)
                        {
                            emp.ReportingStatus = OgeForm450ReportingStatuses.ANNUAL;
                            Update(emp);
                        }

                        this.CreateFormForEmployee(emp, settings.AnnualDueDate);
                    }
                }
                catch (Exception ex)
                {
                    Logger.Log(LogLevel.Critical, ex, ex.Message, ex.StackTrace);
                }
            }

            return settings;
        }

        public SettingsDto InitiateAnnualFiling()
        {
            var settings = SettingsAppService.Get();

            if (settings.InMaintMode == false)
            {
                settings.InMaintMode = true;
                _ = SettingsAppService.Update(settings);

                settings = StartAnnualFiling(settings);

                settings.InMaintMode = false;
                settings = SettingsAppService.Update(settings);
            }

            return settings;
        }
    }
}

