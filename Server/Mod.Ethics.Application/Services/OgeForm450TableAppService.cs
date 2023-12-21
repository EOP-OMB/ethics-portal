using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Ethics.Domain.Views;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Runtime.Session;
using System;
using System.Linq;

namespace Mod.Ethics.Application.Services
{
    public class OgeForm450TableAppService : TableAppServiceBase<TableBase<OgeForm450Dto>, OgeForm450Dto, OgeForm450, OgeForm450Table>
    {
        protected new readonly IOgeForm450Repository Repository;

        public OgeForm450TableAppService(IOgeForm450Repository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            Repository = repository;
        }

        protected override OgeForm450Dto MapToDto(OgeForm450Table entity)
        {
            var dto = base.MapToDto(entity);

            return dto;
        }

        protected override OgeForm450Dto PostMap(OgeForm450Dto dto)
        {
            return base.PostMap(dto);
        }

        public override TableBase<OgeForm450Dto> Get(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            if (sort == "dateOfEmployeeSignature")
            {
                sort = "dateSubmitted";
                sortDirection = sortDirection == "asc" ? "desc" : "asc";
            }

            return base.Get(page, pageSize, sort, sortDirection, filter);
        }

        protected override IQueryable<OgeForm450Table> Filter(IQueryable<OgeForm450Table> query, string filterString)
        {
            var filter = GetFilter(filterString);
            var filterStartDate = DateTime.MinValue;
            var filterEndDate = DateTime.MaxValue;

            if (filter.DaysFilter == DaysFilter.LessThan30)
            {
                filterStartDate = DateTime.Now.AddDays(-30);
                filterEndDate = DateTime.Now;
            }
            else if (filter.DaysFilter == DaysFilter.MoreThan30)
            {
                filterEndDate = DateTime.Now.AddDays(-30);
            }

            filterStartDate = new DateTime(filterStartDate.Year, filterStartDate.Month, filterStartDate.Day);
            filterEndDate = new DateTime(filterEndDate.Year, filterEndDate.Month, filterEndDate.Day, 23, 59, 59);

            return query.Where(x =>
                (string.IsNullOrEmpty(filter.EmployeesName) || x.EmployeesName.ToLower().Contains(filter.EmployeesName.ToLower())) &&
                (filter.Year == 0 || x.CreatedTime.Year == filter.Year) &&
                (string.IsNullOrEmpty(filter.ReportingStatus) || x.ReportingStatus.Contains(filter.ReportingStatus)) &&
                (string.IsNullOrEmpty(filter.FormStatus) || x.FormStatus.Contains(filter.FormStatus) && (filter.FormStatus == OgeForm450Statuses.EXPIRED || !x.FormStatus.Contains(OgeForm450Statuses.EXPIRED))) &&
                (string.IsNullOrEmpty(filter.AssignedToUpn) || x.AssignedToUpn.ToLower() == filter.AssignedToUpn.ToLower()
                    || (filter.AssignedToUpn.ToLower() == "na" && string.IsNullOrEmpty(x.AssignedToUpn))) &&
                (!filter.IsOverdue || x.DueDate < DateTime.Now && (x.FormStatus == OgeForm450Statuses.NOT_STARTED || x.FormStatus == OgeForm450Statuses.DRAFT || x.FormStatus == OgeForm450Statuses.MISSING_INFORMATION)) &&
                (!filter.SubmittedPaperCopy || (x.FormFlags & 1) == 1) &&
                (!filter.IsBlank ||
                    (!(x.HasAssetsOrIncome || x.HasLiabilities || x.HasOutsidePositions || x.HasAgreementsOrArrangements || x.HasGiftsOrTravelReimbursements) &&
                    (x.FormFlags & 1) != 1 &&
                    (x.FormStatus == OgeForm450Statuses.SUBMITTED || x.FormStatus == OgeForm450Statuses.IN_REVIEW || x.FormStatus == OgeForm450Statuses.READY_TO_CERT || x.FormStatus == OgeForm450Statuses.RE_SUBMITTED || x.FormStatus == OgeForm450Statuses.CERTIFIED))) &&
                (filter.DaysExtended == 0 || x.DaysExtended > 0) &&
                (!filter.IsUnchanged || (x.FormFlags & 2) == 2) &&
                //(string.IsNullOrEmpty(filter.ReviewStatus) || x.ReviewStatus == filter.ReviewStatus) &&
                (string.IsNullOrEmpty(filter.SubstantiveReviewerUpn) || x.SubstantiveReviewerUpn == filter.SubstantiveReviewerUpn) &&
                (string.IsNullOrEmpty(filter.DaysFilter) || x.DateSubmitted <= filterEndDate && x.DateSubmitted >= filterStartDate));
        }

        private OgeForm450Dto GetFilter(string filterString)
        {
            var dto = new OgeForm450Dto();

            if (!string.IsNullOrEmpty(filterString))
            {
                var split = filterString.Split(";");

                foreach (string s in split)
                {
                    var keyValue = s.Split('|');

                    if (keyValue.Length > 1)
                    {
                        var key = keyValue[0];
                        var value = keyValue[1];

                        switch (key.ToLower())
                        {
                            case "employeesname":
                                dto.EmployeesName = value;
                                break;
                            case "year":
                                dto.Year = Convert.ToInt32(value);
                                break;
                            case "reportingstatus":
                                dto.ReportingStatus = value;
                                break;
                            case "formstatus":
                                dto.FormStatus = value;
                                break;
                            case "formflags":
                                if (value == OgeForm450TextFlags.OVERDUE)
                                {
                                    dto.IsOverdue = true;
                                }
                                else if (value == OgeForm450TextFlags.PAPER_COPY)
                                {
                                    dto.SubmittedPaperCopy = true;
                                }
                                else if (value == OgeForm450TextFlags.BLANK_SUBMISSION)
                                {
                                    dto.IsBlank = true;
                                }
                                else if (value == OgeForm450TextFlags.EXTENDED)
                                {
                                    dto.DaysExtended = 1;
                                }
                                else if (value == OgeForm450TextFlags.UNCHANGED)
                                {
                                    dto.IsUnchanged = true;
                                }
                                break;
                            case "dateofemployeesignature":
                                dto.DaysFilter = value;
                                break;
                            case "assignedto":
                                dto.AssignedToUpn = value;
                                break;
                            //case "reviewstatus":
                            //    dto.ReviewStatus = value;
                            //    break;
                            case "substantivereviewerupn":
                                dto.SubstantiveReviewerUpn = value;
                                break;
                        }
                    }
                }
            }

            return dto;
        }

        protected override IQueryable<OgeForm450Table> Query()
        {
            return Repository.QueryTable();
        }
    }
}
