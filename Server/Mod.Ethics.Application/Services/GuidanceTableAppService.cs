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
    public class GuidanceTableAppService : TableAppServiceBase<TableBase<GuidanceDto>, GuidanceDto, Guidance, Guidance>
    {
        private new readonly IGuidanceRepository Repository;
        private IEmployeeAppService EmployeeAppService;

        public GuidanceTableAppService(IGuidanceRepository repository, IEmployeeAppService employeeService, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            Repository = repository;
            EmployeeAppService = employeeService;
        }

        public override TableBase<GuidanceDto> Get(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            if (sort == "eventDates")
            {
                sort = "eventStartDate";
                sortDirection = sortDirection == "asc" ? "asc" : "desc";
            }

            var tb = base.Get(page, pageSize, sort, sortDirection, filter);
            
            return tb;
        }

        protected override IQueryable<Guidance> Filter(IQueryable<Guidance> query, string filterString)
        {
            GuidanceDto filter = GetFilter(filterString);
            var filterStartDate = DateTime.MinValue;
            var filterEndDate = DateTime.MaxValue;

            if (filter.DateFilter == DateFilter.Past)
            {
                filterEndDate = DateTime.Now.AddDays(-1);
            }
            else if (filter.DateFilter == DateFilter.Next7Days)
            {
                filterStartDate = DateTime.Now;
                filterEndDate = DateTime.Now.AddDays(7);
            }
            else if (filter.DateFilter == DateFilter.Between7And30)
            {
                filterStartDate = DateTime.Now.AddDays(8);
                filterEndDate = DateTime.Now.AddDays(30);
            }
            else if (filter.DateFilter == DateFilter.MoreThan30)
            {
                filterStartDate = DateTime.Now.AddDays(31);
            }

            filterStartDate = new DateTime(filterStartDate.Year, filterStartDate.Month, filterStartDate.Day);
            filterEndDate = new DateTime(filterEndDate.Year, filterEndDate.Month, filterEndDate.Day, 23, 59, 59);
          
            return query.Where(x => 
                (string.IsNullOrEmpty(filter.EmployeeName) || x.EmployeeName.ToLower().Contains(filter.EmployeeName.ToLower())) &&
                (string.IsNullOrEmpty(filter.FilerType) || x.FilerType.ToLower().Contains(filter.FilerType.ToLower())) &&
                (string.IsNullOrEmpty(filter.Summary) || x.Summary.ToLower().Contains(filter.Summary.ToLower())) &&
                (string.IsNullOrEmpty(filter.GuidanceType) || x.EmployeeName.ToLower().Contains(filter.GuidanceType.ToLower())) &&
                x.DateOfGuidance <= filterEndDate && x.DateOfGuidance >= filterStartDate && 
                (string.IsNullOrEmpty(filter.Subject) || x.Subject.Contains(filter.Subject)));
        }

        private GuidanceDto GetFilter(string filterString)
        {
            var dto = new GuidanceDto();

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
                            case "employeeName":
                                dto.EmployeeName = value;
                                break;
                            case "filerType":
                                dto.FilerType = value;
                                break;
                            case "summary":
                                dto.Summary = value;
                                break;
                            case "guidanceType":
                                dto.GuidanceType = value;
                                break;
                            case "subject":
                                dto.Subject = value;
                                break;
                            case "dateFilter":
                                dto.DateFilter = value;
                                break;
                        }
                    }
                }
            }

            return dto;
        }

        protected override IQueryable<Guidance> Query()
        {
            return Repository.QueryTable();
        }
    }
}
