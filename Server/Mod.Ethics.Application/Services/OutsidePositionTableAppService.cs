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
using System.Runtime.CompilerServices;

namespace Mod.Ethics.Application.Services
{
    public class OutsidePositionTableAppService : TableAppServiceBase<TableBase<OutsidePositionDto>, OutsidePositionDto, OutsidePosition, OutsidePosition>
    {
        private new readonly IOutsidePositionRepository Repository;

        public OutsidePositionTableAppService(IOutsidePositionRepository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            Repository = repository;
        }

        public override TableBase<OutsidePositionDto> Get(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            //if (sort == "eventDates")
            //{
            //    sort = "eventStartDate";
            //    sortDirection = sortDirection == "asc" ? "asc" : "desc";
            //}

            var tb = base.Get(page, pageSize, sort, sortDirection, filter);

            return tb;
        }

        protected override IQueryable<OutsidePosition> Filter(IQueryable<OutsidePosition> query, string filterString)
        {
            OutsidePositionDto filter = GetFilter(filterString);

            return query.Where(x =>
                // Permissions
                ((Session.Principal.IsInRole(Roles.EthicsAppAdmin) || Session.Principal.IsInRole(Roles.OGESupport) || Session.Principal.IsInRole(Roles.FOIA)
                || x.EmployeeUpn == Session.Principal.Upn || (x.SupervisorUpn == Session.Principal.Upn && x.Status != OutsidePositionStatuses.DRAFT)) &&
                //Filters
                (string.IsNullOrEmpty(filter.OrganizationName) || x.OrganizationName.ToLower().Contains(filter.OrganizationName.ToLower())) &&
                (string.IsNullOrEmpty(filter.EmployeeName) || x.EmployeeName.ToLower().Contains(filter.EmployeeName.ToLower())) &&
                (string.IsNullOrEmpty(filter.PositionTitle) || x.PositionTitle.Contains(filter.PositionTitle.ToLower())) &&
                (string.IsNullOrEmpty(filter.SupervisorUpn) ||
                    (
                        (x.Status == OutsidePositionStatuses.AWAITING_MANAGER && x.SupervisorUpn == filter.SupervisorUpn) ||
                        (x.Status == OutsidePositionStatuses.AWAITING_ETHICS && filter.SupervisorUpn == Session.Principal.Upn && (Session.Principal.IsInRole(Roles.EthicsAppAdmin) || Session.Principal.IsInRole(Roles.OGESupport)))
                    )
                ) &&
                (string.IsNullOrEmpty(filter.Status) || x.Status.Contains(filter.Status))));
        }

        private OutsidePositionDto GetFilter(string filterString)
        {
            var dto = new OutsidePositionDto();

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
                            case "employeename":
                                dto.EmployeeName = value;
                                break;
                            case "positiontitle":
                                dto.PositionTitle = value;
                                break;
                            //case "datefilter":
                            //    dto.DateFilter = value;
                            //    break;
                            case "nextapprover":
                                dto.SupervisorUpn = value;
                                break;
                            case "status":
                                dto.Status = value;
                                break;
                            case "organizationname":
                                dto.OrganizationName = value;
                                break;
                        }
                    }
                }
            }

            return dto;
        }

        protected override IQueryable<OutsidePosition> Query()
        {
            return Repository.Query();
        }
    }
}
