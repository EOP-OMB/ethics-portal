using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Runtime.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using Mod.Framework.User.Interfaces;
using Mod.Framework.User.Entities;
using Mod.Framework.Notifications.Domain.Services;
using Mod.Framework.Notifications.Domain.Entities;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Mvc;
using Mod.Framework.Configuration;
using Mod.Framework.Domain.Entities;

namespace Mod.Ethics.Application.Services
{
    public class OgeForm450AppService : CrudAppService<OgeForm450Dto, OgeForm450>, IOgeForm450AppService
    {
        public const int MIN_ASSETS = 5;
        public const int MIN_LIABILITIES = 2;
        public const int MIN_POSITIONS = 6;
        public const int MIN_AGREEMENTS = 4;
        public const int MIN_GIFTS = 3;

        private readonly ISettingsAppService SettingsService;
        private readonly IEmployeeRepository EmployeeRepository;
        private readonly INotificationDomService NotificationService;

        private new readonly IOgeForm450Repository Repository;
        private readonly IOgeForm450ExtensionRequestRepository ExtensionRepository;

        private readonly List<EmployeeListDto> Reviewers;

        private List<Notification> _pendingEmails;

        public OgeForm450AppService(IOgeForm450Repository repository, INotificationDomService notificationService, ISettingsAppService settingsService, IEmployeeRepository employeeRepo, IEmployeeListAppService employeeService, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session, IOgeForm450ExtensionRequestRepository extensionRepo) : base(repository, objectMapper, logger, session)
        {
            SettingsService = settingsService;
            EmployeeRepository = employeeRepo;
            Repository = repository;
            NotificationService = notificationService;

            Reviewers = employeeService.GetReviewers();
            ExtensionRepository = extensionRepo;
        }

        public override IEnumerable<OgeForm450Dto> GetAll()
        {
            var list = GetAllIncluding(x => x.OgeForm450Statuses);
            
            return list.OrderBy(x => x.EmployeesName).ToList();
        }

        public override IEnumerable<OgeForm450Dto> GetBy(Expression<Func<OgeForm450, bool>> predicate)
        {
            var list = GetByIncluding(predicate, x => x.OgeForm450Statuses);

            return list.OrderBy(x => x.EmployeesName).ToList();
        }

        public override OgeForm450Dto Get(int id)
        {
            var form = GetIncluding(id, x => x.OgeForm450Statuses, y => y.ReportableInformation);
            var prev = GetPreviousForm(form.Year, form.Filer);
            
            if (form != null)
                SetReportableInformation(form, prev);

            return form;
        }

        public OgeForm450Dto GetCurrentForm()
        {
            var settings = SettingsService.Get();
            var form = GetByIncluding(x => x.FilerUpn.ToLower() == Session.UserId.ToLower() && x.FormStatus != OgeForm450Statuses.CANCELED, y => y.OgeForm450Statuses, z => z.ReportableInformation).OrderByDescending(x => Convert.ToDateTime(x.DueDate)).FirstOrDefault();
            if (form != null)
                SetReportableInformation(form, null);

            return form;
        }

        public IEnumerable<OgeForm450Dto> GetMyForms()
        {
            var list = GetByIncluding(x => x.FilerUpn == Session.UserId, y => y.OgeForm450Statuses).ToList();

            return list;
        }

        public IEnumerable<OgeForm450Dto> GetFormsByEmployee(string upn)
        {
            var list = GetByIncluding(x => x.FilerUpn == upn, y => y.OgeForm450Statuses).ToList();

            return list;
        }

        public OgeForm450Dto GetPreviousForm(int id)
        {
            OgeForm450Dto form;

            // First get the current form
            if (id > 0)
                form = Get(id);
            else
                form = GetCurrentForm();

            if (form != null)
            {
                // if has current form, find previous by year and filer
                var prev = Repository.GetPreviousForm(form.Year, form.Filer);

                if (prev != null)
                {
                    // Has a previous form, go ahead and use the already canned functions to get that form with the included information
                    // could combine this step and the GetPreviousForm above, but re-used functions where availble.
                    form = GetIncluding(prev.Id, x => x.OgeForm450Statuses, y => y.ReportableInformation);
                    if (form != null)
                        SetReportableInformation(form, null);
                }
                else
                {
                    form = null;
                }
            }

            return form;
        }

        private OgeForm450Dto GetPreviousForm(int year, string upn)
        {
            var form = MapToDto(Repository.GetPreviousForm(year, upn));
            return form;
        }

        public IEnumerable<OgeForm450Dto> GetReviewableForms()
        {
            var list = GetByIncluding(x =>
                    x.FormStatus == OgeForm450Statuses.IN_REVIEW ||
                    x.FormStatus == OgeForm450Statuses.READY_TO_CERT ||
                    x.FormStatus == OgeForm450Statuses.SUBMITTED ||
                    x.FormStatus == OgeForm450Statuses.RE_SUBMITTED ||
                    x.FormStatus == OgeForm450Statuses.NOT_STARTED ||
                    x.FormStatus == OgeForm450Statuses.DRAFT ||
                    x.FormStatus == OgeForm450Statuses.MISSING_INFORMATION, y => y.OgeForm450Statuses).ToList();

            return list.OrderBy(x => x.EmployeesName).ToList();
        }

        public IEnumerable<OgeForm450Dto> CertifyForms(string flag)
        {
            var formsToCertify = GetReviewableForms();

            if (flag == "unchanged")
            {
                formsToCertify = formsToCertify.Where(x => x.IsUnchanged == true && this.IsSubmitted(x)).ToList();
            } 
            else if (flag == "blank")
            {
                // Added constraint of only certifying ANNUAL forms per Laurie's request 7/11/2019 -SBK
                formsToCertify = formsToCertify.Where(x => x.IsBlank == true && x.ReportingStatus == OgeForm450ReportingStatuses.ANNUAL && this.IsSubmitted(x)).ToList();
            }

            foreach (OgeForm450Dto form in formsToCertify)
            {
                form.ReviewingOfficialSignature = Session.Principal.DisplayName;
                Update(form);
            }

            return formsToCertify;
        }

        private bool IsSubmitted(OgeForm450Dto form)
        {
            return (form.FormStatus == OgeForm450Statuses.SUBMITTED || form.FormStatus == OgeForm450Statuses.RE_SUBMITTED || form.FormStatus == OgeForm450Statuses.IN_REVIEW || form.FormStatus == OgeForm450Statuses.READY_TO_CERT);
        }

        private bool IsSubmitted(OgeForm450 form)
        {
            return (form.FormStatus == OgeForm450Statuses.SUBMITTED || form.FormStatus == OgeForm450Statuses.RE_SUBMITTED || form.FormStatus == OgeForm450Statuses.IN_REVIEW || form.FormStatus == OgeForm450Statuses.READY_TO_CERT);
        }

        public override OgeForm450Dto Create(OgeForm450Dto dto)
        {
            throw new System.NotSupportedException();
        }

        // Must include emp.EmployeeMetadata
        // When Creating new Annual Filing
        // dueDate = DateHelper.GetNextBusinessDay(settings.AnnualDueDate, 0);

        // When Creating from employee save:
        // dueDate = emp.DueDate ?? GetNextBusinessDay(DateTime.Now, 30);
        public OgeForm450Dto GenerateNewForm(EmployeeDto emp, DateTime dueDate, OgeForm450 previousForm = null)
        {
            var form = new OgeForm450();

            // Filer Information
            form.FilerUpn = emp.Upn;
            form.Agency = emp.Agency;
            form.BranchUnitAndAddress = emp.Office;

            var appointmentDate = emp.AppointmentDate;

            if (!string.IsNullOrEmpty(appointmentDate) && DateTime.TryParse(appointmentDate, out DateTime dateOfAppointment))
                form.DateOfAppointment = dateOfAppointment;

            form.EmailAddress = emp.EmailAddress;
            form.EmployeesName = emp.DisplayName;
            form.DueDate = dueDate;
            form.FormStatus = OgeForm450Statuses.NOT_STARTED;
            form.ReportingStatus = emp.ReportingStatus;
            form.Title = emp.DisplayName + " (" + DateTime.Now.Year.ToString() + ")";
            form.WorkPhone = emp.MobilePhone;
            form.PositionTitle = emp.Title;

            form.CorrelationId = Guid.NewGuid().ToString();
            form.FormFlags = 0;

            if (previousForm != null)
            {
                // Copy info from previous Form
                form.Grade = previousForm.Grade;
                form.PositionTitle = previousForm.PositionTitle;

                form.HasAgreementsOrArrangements = previousForm.HasAgreementsOrArrangements;
                form.HasAssetsOrIncome = previousForm.HasAssetsOrIncome;
                form.HasGiftsOrTravelReimbursements = previousForm.HasGiftsOrTravelReimbursements;
                form.HasLiabilities = previousForm.HasLiabilities;
                form.HasOutsidePositions = previousForm.HasOutsidePositions;
                form.IsSpecialGovernmentEmployee = previousForm.IsSpecialGovernmentEmployee;
                form.SgeMailingAddress = previousForm.SgeMailingAddress;

                if (previousForm.ReportableInformation != null)
                {
                    form.ReportableInformation = new List<OgeForm450ReportableInformation>();

                    foreach (OgeForm450ReportableInformation ri in previousForm.ReportableInformation)
                    {
                        if (!ri.IsDeleted)
                        {
                            var newInfo = new OgeForm450ReportableInformation
                            {
                                AdditionalInfo = ri.AdditionalInfo,
                                Description = ri.Description,
                                Type = ri.Type,
                                Name = ri.Name,
                                NoLongerHeld = ri.NoLongerHeld
                            };

                            form.ReportableInformation.Add(newInfo);
                        }
                    }
                }
            }

            form = Repository.Save(form);
            var dto = MapToDto(form);

            GenerateNewFormEmails(emp, dto);

            return dto;
        }

        private void GenerateNewFormEmails(EmployeeDto emp, OgeForm450Dto form)
        {
            var dict = GetEmailData(form);

            if (form.ReportingStatus == OgeForm450ReportingStatuses.NEW_ENTRANT)
            {
                var notification = NotificationService.CreateNotification((int)NotificationTypes.FormNewEntrant, form.EmailAddress, dict, emp.NewEntrantEmailText, "");
                NotificationService.AddNotification(notification);
            }
            else if (form.ReportingStatus == OgeForm450ReportingStatuses.ANNUAL)
            {
                var notification = NotificationService.CreateNotification((int)NotificationTypes.FormNewAnnual, form.EmailAddress, dict, emp.AnnualEmailText, "");
                NotificationService.AddNotification(notification);
            }
        }

        public override OgeForm450Dto Update(OgeForm450Dto dto)
        {
            if (!Permissions.CanUpdate && dto.Filer != Session.Principal?.Upn)
                throw new SecurityException("Access denied.  Cannot update object of type " + typeof(OgeForm450).Name);

            var e = new CrudEventArgs<OgeForm450Dto, OgeForm450>();
            var entity = Repository.GetIncluding(dto.Id, y => y.OgeForm450Statuses, z => z.ReportableInformation);

            e.Entity = entity;
            e.Dto = dto;

            OnBeforeUpdate(e);

            if (!e.Cancel)
            {
                MapToEntity(dto, e.Entity);

                Repository.Update(e.Entity);

                e.Dto = PostMap(MapToDto(e.Entity));

                OnUpdated(e);
            }

            return e.Dto;
        }

        protected override void MapToEntity(OgeForm450Dto updateInput, OgeForm450 entity)
        {
            base.MapToEntity(updateInput, entity);

            // Handle Updates/Deletes
            foreach (var ri in entity.ReportableInformation)
            {
                var dto = updateInput.ReportableInformationList.FirstOrDefault(x => x.Id == ri.Id);
                if (dto is null)
                {
                    // Reportable Info was removed
                    ri.IsDeleted = true;
                }
                else
                {
                    MapReportableInformation(dto, ri);
                }
            }

            // Handle Adds
            foreach (var riDto in updateInput.ReportableInformationList)
            {
                if (riDto.Id == 0)
                {
                    var ri = new OgeForm450ReportableInformation();

                    MapReportableInformation(riDto, ri);

                    entity.ReportableInformation.Add(ri);
                }
            }
        }

        private void MapReportableInformation(ReportableInformationDto dto, OgeForm450ReportableInformation ri)
        {
            ri.Type = dto.InfoType;
            ri.Name = dto.Name;
            ri.Description = dto.Description;
            ri.AdditionalInfo = dto.AdditionalInfo;
            ri.NoLongerHeld = dto.NoLongerHeld;
        }

        protected override void OnBeforeUpdate(CrudEventArgs<OgeForm450Dto, OgeForm450> e)
        {
            var filer = EmployeeRepository.GetAllNoFilter(x => x.Upn.ToLower() == e.Dto.Filer.ToLower()).Single();
            var dict = GetEmailData(e.Dto);

            this._pendingEmails = new List<Notification>();

            e.Cancel = !CanSave(filer, e.Entity);
            e.Dto.ClearEmptyReportableInformation();

            if (!e.Dto.HasAssetsOrIncome)
                e.Dto.ReportableInformationList.Where(x => x.InfoType == ReportableInformationType.AssetsAndIncome).ToList().ForEach(x => x.IsDeleted = true);

            if (!e.Dto.HasAgreementsOrArrangements)
                e.Dto.ReportableInformationList.Where(x => x.InfoType == ReportableInformationType.AgreementsOrArrangements).ToList().ForEach(x => x.IsDeleted = true);

            if (!e.Dto.HasOutsidePositions)
                e.Dto.ReportableInformationList.Where(x => x.InfoType == ReportableInformationType.OutsidePositions).ToList().ForEach(x => x.IsDeleted = true);

            if (!e.Dto.HasGiftsOrTravelReimbursements)
                e.Dto.ReportableInformationList.Where(x => x.InfoType == ReportableInformationType.GiftsOrTravelReimbursements).ToList().ForEach(x => x.IsDeleted = true);

            if (!e.Dto.HasLiabilities)
                e.Dto.ReportableInformationList.Where(x => x.InfoType == ReportableInformationType.Liabilities).ToList().ForEach(x => x.IsDeleted = true);

            if (!e.Cancel)
            {
                // We can save, run the rest of the checks
                RunUpdateChecks(e);
                CheckForSubmission(e, filer, dict);

                if ((e.Dto.FormStatus == OgeForm450Statuses.NOT_STARTED || string.IsNullOrEmpty(e.Dto.FormStatus)) && Convert.ToDateTime(e.Dto.DueDate) == e.Entity.DueDate && Session.Principal.Upn.ToLower() == filer.Upn.ToLower())
                {
                    // If the form is being saved for the first time (ie status is "Not Started"), update it to Draft
                    // Only if it's the filer making the change and not an admin changing the due date.
                    e.Dto.FormStatus = OgeForm450Statuses.DRAFT;
                }

                CheckForReviewerAdminSupportActivity(e, filer, dict);
            }
            Logger.LogInformation("after OnBeforeUpdate e.Cancel = " + e.Cancel);
        }

        private void CheckForReviewerAdminSupportActivity(CrudEventArgs<OgeForm450Dto, OgeForm450> e, Employee filer, Dictionary<string, string> dict)
        {
            if (Session.Principal.IsInRole(Roles.OGEReviewer) || Session.Principal.IsInRole(Roles.EthicsAppAdmin) || Session.Principal.IsInRole(Roles.OGESupport))
            {
                if (!string.IsNullOrEmpty(e.Dto.SubstantiveReviewer))
                {
                    e.Dto.DateOfSubstantiveReview = e.Dto.DateOfSubstantiveReview.HasValue ? e.Dto.DateOfSubstantiveReview.Value : DateTime.Now;
                }

                // Only Admin and Reviewer can reject/ceritfy.  Support can do Initial Review
                RejectOrCertifyForm(e, filer, dict);
            }
        }

        private void CheckForSubmission(CrudEventArgs<OgeForm450Dto, OgeForm450> e, Employee filer, Dictionary<string, string> dict)
        {
            if ((Session.Principal.Upn.ToLower() == filer.Upn.ToLower() || e.Dto.SubmittedPaperCopy) && e.Dto.IsSubmitting == true)
            {
                // If the Employee signed the form, stamp the date/time and update the FormStatus to Submitted
                if (e.Entity.FormStatus == OgeForm450Statuses.MISSING_INFORMATION)
                {
                    // Re-submission
                    e.Dto.FormStatus = OgeForm450Statuses.RE_SUBMITTED;
                    e.Dto.ReSubmittedDate = DateTime.Now.Date;
                }
                else
                {
                    // First Submission
                    e.Dto.FormStatus = OgeForm450Statuses.SUBMITTED;
                    if (!e.Dto.SubmittedPaperCopy)
                    {
                        e.Dto.EmployeeSignature = Session.Principal.DisplayName;
                        e.Dto.DateOfEmployeeSignature = DateTime.Now.Date;
                    }

                    e.Dto.DateReceivedByAgency = DateTime.Now;
                }

                e.Dto.IsUnchanged = CompareVsPreviousForm(e.Dto);

                var notification = NotificationService.CreateNotification((int)NotificationTypes.FormSubmitted, Session.Principal.EmailAddress, dict, "");
                _pendingEmails.Add(notification);
                notification = NotificationService.CreateNotification((int)NotificationTypes.FormConfirmation, filer.EmailAddress, dict, "");
                _pendingEmails.Add(notification);
            }
        }

        private void RejectOrCertifyForm(CrudEventArgs<OgeForm450Dto, OgeForm450> e, Employee filer, Dictionary<string, string> dict)
        {
            if (Session.Principal.IsInRole(Roles.OGEReviewer) || Session.Principal.IsInRole(Roles.EthicsAppAdmin))
            {
                if (e.Dto.IsRejected)
                {
                    e.Dto.FormStatus = OgeForm450Statuses.MISSING_INFORMATION;

                    var notification = NotificationService.CreateNotification((int)NotificationTypes.FormMissingInformation, filer.EmailAddress, dict, "");
                    _pendingEmails.Add(notification);
                }

                var certified = e.Entity.OgeForm450Statuses.SingleOrDefault(x => x.Status == OgeForm450Statuses.CERTIFIED);

                if (certified == null && !string.IsNullOrEmpty(e.Dto.ReviewingOfficialSignature))
                {
                    // If the reviewing official signed the form, stamp the date/time and update the FormStatus to Certified
                    e.Dto.DateOfReviewerSignature = DateTime.Now;
                    e.Dto.FormStatus = OgeForm450Statuses.CERTIFIED;
                    
                    if (e.Dto.SubmittedPaperCopy)
                    {
                        // if we're certifying a Paper Copy, Insert Note
                        e.Dto.CommentsOfReviewingOfficial = "Certification based on filer’s paper submission.\r\n" + e.Dto.CommentsOfReviewingOfficial;
                    }

                    var notification = NotificationService.CreateNotification((int)NotificationTypes.FormCertified, filer.EmailAddress, dict, "");
                    _pendingEmails.Add(notification);
                }
            }
        }


        private void RunUpdateChecks(CrudEventArgs<OgeForm450Dto, OgeForm450> e)
        {
            if ((e.Dto.DaysExtended != e.Entity.DaysExtended && Convert.ToDateTime(e.Dto.DueDate) != e.Entity.DueDate) || (Convert.ToDateTime(e.Dto.DueDate) != e.Entity.DueDate && !Session.Principal.IsInRole(Roles.EthicsAppAdmin)))
            {
                // if here, form has been extended after form was loaded and subsequently saved.  Use the old item's due date.
                e.Dto.DueDate = e.Entity.DueDate.ToShortDateString();
            }

            // Set status back to old item (do not update FormStatus, or DaysExtended, set elsewhere)
            if (e.Dto.FormStatus == OgeForm450Statuses.CANCELED)
            {
                // If we're trying to cancel the form and not an admin, disallow cancelation
                if (!Session.Principal.IsInRole(Roles.EthicsAppAdmin))
                {
                    e.Dto.FormStatus = e.Entity.FormStatus;
                }
                else
                {
                    // we are an admin, cancel the form.

                    RemoveExtensions(e.Dto.Id);
                }
            }
        }

        protected override void OnUpdated(CrudEventArgs<OgeForm450Dto, OgeForm450> e)
        {
            if (e.Entity.FormStatus == OgeForm450Statuses.CERTIFIED)
            {
                // Update Last 450 File Date
                var emp = EmployeeRepository.GetByUpn(e.Entity.FilerUpn);
                if (emp != null)
                {
                    emp.SetAttributeValue(EmployeeAttributes.Last450Date, e.Dto.DateOfReviewerSignature.ToString());
                    EmployeeRepository.SaveChanges();
                }

                // Clear all Pending Extensions
                var extensions = ExtensionRepository.GetAll(x => x.Status == ExtensionRequestStatuses.PENDING);

                if (extensions.Count > 0)
                {
                    foreach (OgeForm450ExtensionRequest ext in extensions)
                    {
                        ext.Status = ExtensionRequestStatuses.CANCELED;
                    }

                    ExtensionRepository.SaveChanges();
                }
            }

            foreach (Notification n in _pendingEmails)
            {
                NotificationService.AddNotification(n);
            }

            e.Dto.ReportableInformationList = e.Dto.ReportableInformationList.Where(x => !x.IsDeleted).ToList();
            SetReportableInformation(e.Dto, null);
        }

        private bool CanSave(Employee filer, OgeForm450 oldForm)
        {
            // can save this form if it's the user's form or if user is an admin or reviewer
            var canUserSave = (Session.Principal.Upn == filer.Upn.ToLower() && (oldForm.FormStatus == OgeForm450Statuses.DRAFT || oldForm.FormStatus == OgeForm450Statuses.NOT_STARTED || oldForm.FormStatus == OgeForm450Statuses.MISSING_INFORMATION));
            var canReviewerSave = Session.Principal.IsInRole(Roles.OGEReviewer) && this.IsSubmitted(oldForm);

            return canUserSave || canReviewerSave || Session.Principal.IsInRole(Roles.EthicsAppAdmin) || Session.Principal.IsInRole(Roles.OGESupport);
        }

        private bool CompareVsPreviousForm(OgeForm450Dto dto)
        {
            // Get previous year's Form
            var prev = GetPreviousForm(dto.Year, dto.Filer);
            var unchanged = false;

            // If previous year's form exists and it was certified
            if (prev != null && prev.FormStatus == OgeForm450Statuses.CERTIFIED)
            {
                unchanged = true;

                // Compare fields to determine if unchanged
                // When checking if a form is changed or not we will not consider the fields Name, email, and Phone number.
                // Fields that would be considered a “change” include all relevant form data: Answers 
                unchanged &= prev.HasAgreementsOrArrangements == dto.HasAgreementsOrArrangements;
                unchanged &= prev.HasAssetsOrIncome == dto.HasAssetsOrIncome;
                unchanged &= prev.HasGiftsOrTravelReimbursements == dto.HasGiftsOrTravelReimbursements;
                unchanged &= prev.HasLiabilities == dto.HasLiabilities;
                unchanged &= prev.HasOutsidePositions == dto.HasOutsidePositions;

                // and Reportable Information
                if (dto.ReportableInformationList.Count == prev.ReportableInformationList.Count)
                {
                    foreach (ReportableInformationDto ri in dto.ReportableInformationList)
                    {
                        var prevRi = prev.ReportableInformationList.Where(x => x.AdditionalInfo == ri.AdditionalInfo && x.Description == ri.Description && x.InfoType == ri.InfoType && x.Name == ri.Name && x.NoLongerHeld == ri.NoLongerHeld).FirstOrDefault();

                        unchanged &= prevRi != null;
                    }

                    // as well as Position, Grade, Branch, and SGE checkbox.
                    unchanged &= prev.PositionTitle == dto.PositionTitle;
                    unchanged &= prev.Grade == dto.Grade;
                    unchanged &= prev.BranchUnitAndAddress == dto.BranchUnitAndAddress;
                    unchanged &= prev.IsSpecialGovernmentEmployee == dto.IsSpecialGovernmentEmployee;
                }
                else
                {
                    unchanged = false;
                }
            }

            return unchanged;
        }

        protected override OgeForm450Dto PostMap(OgeForm450Dto dto)
        {
            dto = base.PostMap(dto);

            return dto;
        }

        private static void SetReportableInformation(OgeForm450Dto form, OgeForm450Dto compareForm)
        {
            if (form.ReportableInformationList == null)
            {
                form.ReportableInformationList = new List<ReportableInformationDto>();
            }

            var count = form.ReportableInformationList.Count(x => x.InfoType == ReportableInformationType.AssetsAndIncome);
            for (int i = count; i < CalcMin(MIN_ASSETS, form, compareForm, ReportableInformationType.AssetsAndIncome); i++)
                form.ReportableInformationList.Add(new ReportableInformationDto(ReportableInformationType.AssetsAndIncome));

            count = form.ReportableInformationList.Count(x => x.InfoType == ReportableInformationType.Liabilities);
            for (int i = count; i < CalcMin(MIN_LIABILITIES, form, compareForm, ReportableInformationType.Liabilities); i++)
                form.ReportableInformationList.Add(new ReportableInformationDto(ReportableInformationType.Liabilities));

            count = form.ReportableInformationList.Count(x => x.InfoType == ReportableInformationType.OutsidePositions);
            for (int i = count; i < CalcMin(MIN_POSITIONS, form, compareForm, ReportableInformationType.OutsidePositions); i++)
                form.ReportableInformationList.Add(new ReportableInformationDto(ReportableInformationType.OutsidePositions));

            count = form.ReportableInformationList.Count(x => x.InfoType == ReportableInformationType.AgreementsOrArrangements);
            for (int i = count; i < CalcMin(MIN_AGREEMENTS, form, compareForm, ReportableInformationType.AgreementsOrArrangements); i++)
                form.ReportableInformationList.Add(new ReportableInformationDto(ReportableInformationType.AgreementsOrArrangements));

            count = form.ReportableInformationList.Count(x => x.InfoType == ReportableInformationType.GiftsOrTravelReimbursements);
            for (int i = count; i < CalcMin(MIN_GIFTS, form, compareForm, ReportableInformationType.GiftsOrTravelReimbursements); i++)
                form.ReportableInformationList.Add(new ReportableInformationDto(ReportableInformationType.GiftsOrTravelReimbursements));
        }

        private static int CalcMin(int min, OgeForm450Dto form, OgeForm450Dto compareForm, string type)
        {
            var formCount = form != null ? form.ReportableInformationList.Count(x => x.InfoType == type) : min;
            var compareCount = compareForm != null ? compareForm.ReportableInformationList.Count(x => x.InfoType == type) : min;

            var count = formCount > compareCount ? formCount : compareCount;
            return count < min ? min : count;
        }

        public void Extend(ExtensionRequestDto extension)
        {
            var form = Repository.GetIncluding(extension.OgeForm450Id, x => x.OgeForm450Statuses);

            form.DueDate = extension.ExtensionDate;
            form.DaysExtended += extension.DaysRequested;

            Repository.Update(form);
        }

        public Dictionary<string, string> GetEmailData(OgeForm450Dto dto)
        {
            var user = Session.Principal;
            var dict = new Dictionary<string, string>();
            var settings = SettingsService.Get();

            dict = SettingsService.AppendEmailData(dict, settings);

            dict.Add("User", user.DisplayName);
            dict.Add("Email", user.EmailAddress);

            dict.Add("Note", dto.Note);
            dict.Add("Filer", dto.EmployeesName);
            dict.Add("ReviewerNote", dto.CommentsOfReviewingOfficial);
            dict.Add("RejectionNotes", dto.RejectionNotes);
            dict.Add("DueDate", Convert.ToDateTime(dto.DueDate).ToShortDateString());

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

        public void RemoveExtensions(int id)
        {
            //  Set Pending Extensions to Canceled
            var form = Repository.GetIncluding(id, y => y.ExtensionRequests);

            foreach (OgeForm450ExtensionRequest ext in form.ExtensionRequests)
            {
                ext.Status = ExtensionRequestStatuses.CANCELED;
            }

            Repository.Update(form); 
        }

        public OgeForm450Summary GetSummary()
        {
            var summary = new OgeForm450Summary();

            summary.SubmittedForms = Repository.GetAll(x => x.FormStatus == OgeForm450Statuses.SUBMITTED || x.FormStatus == OgeForm450Statuses.RE_SUBMITTED).Count();
            summary.Extensions = ExtensionRepository.GetAll(x => x.Status == ExtensionRequestStatuses.PENDING).Count();
            summary.OverdueForms = Repository.GetAll(x => x.DueDate <=  DateTime.Now && (x.FormStatus == OgeForm450Statuses.NOT_STARTED || x.FormStatus == OgeForm450Statuses.DRAFT || x.FormStatus == OgeForm450Statuses.MISSING_INFORMATION)).Count();
            summary.ReadyToCertify = Repository.GetAll(x => x.FormStatus == OgeForm450Statuses.READY_TO_CERT).Count();

            return summary;
        }

        public ActionResult<OgeForm450> AssignForm(int id, string assignedToUpn)
        {
            var form = Repository.Get(id);
            var employee = assignedToUpn == null ? null : Reviewers.Where(x => x.Upn.ToLower() == assignedToUpn.ToLower()).FirstOrDefault();
            form.AssignedToUpn = assignedToUpn;
            form.AssignedTo = employee?.DisplayName;
            return Repository.Save(form);
        }

        public OgeForm450StatusChart GetStatusChart()
        {
            var data = new OgeForm450StatusChart();

            data.Labels = new List<string>(new string[] { "Not-Started", "Draft", "Missing Information", "Overdue", "Submitted", "Certified" });

            var settings = SettingsService.Get();

            var forms = GetBy(x => x.CreatedTime.Year == DateTime.Now.Year);

            var notStarted = forms.Where(x => x.FormStatus == OgeForm450Statuses.NOT_STARTED).Count();
            var draft = forms.Where(x => x.FormStatus == OgeForm450Statuses.DRAFT).Count();
            var missingInfo = forms.Where(x => x.FormStatus == OgeForm450Statuses.MISSING_INFORMATION).Count();
            var overdue = forms.Where(x => x.IsOverdue == true).Count();
            var submitted = forms.Where(x => x.FormStatus == OgeForm450Statuses.SUBMITTED || x.FormStatus == OgeForm450Statuses.RE_SUBMITTED).Count();
            var certified = forms.Where(x => x.FormStatus == OgeForm450Statuses.CERTIFIED).Count();
            var inReview = forms.Where(x => x.FormStatus == OgeForm450Statuses.IN_REVIEW).Count();
            var readyToCert = forms.Where(x => x.FormStatus == OgeForm450Statuses.READY_TO_CERT).Count();
            var declined = forms.Where(x => x.FormStatus == OgeForm450Statuses.DECLINED).Count();

            data.Data = new List<int>(new int[] { notStarted, draft, missingInfo, overdue, inReview + readyToCert + submitted, certified + declined });

            return data;
        }
    }
}
