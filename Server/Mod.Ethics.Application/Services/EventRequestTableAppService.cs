using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
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
    public class EventRequestTableAppService : TableAppServiceBase<TableBase<EventRequestDto>, EventRequestDto, EventRequest, EventRequestTable>
    {
        private new readonly IEventRequestRepository Repository;
        private IEmployeeAppService EmployeeAppService;

        public EventRequestTableAppService(IEventRequestRepository repository, IEmployeeAppService employeeService, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            Repository = repository;
            EmployeeAppService = employeeService;
        }

        public override TableBase<EventRequestDto> Get(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            if (sort == "eventDates")
            {
                sort = "eventStartDate";
                sortDirection = sortDirection == "asc" ? "asc" : "desc";
            }

            var tb = base.Get(page, pageSize, sort, sortDirection, filter);

            foreach (EventRequestDto er in tb.Data)
            {
                var attendeeString = "";
                foreach (AttendeeDto att in er.EventRequestAttendees)
                {
                    if (att.EmployeeUpn != null)
                    {
                        att.Employee = EmployeeAppService.GetByUpn(att.EmployeeUpn);
                    }

                    if (att.Employee != null)
                        attendeeString += att.Employee.DisplayName + "; ";
                    else
                        attendeeString += att.EmployeeName;
                }

                er.AttendeesString = attendeeString.TrimEnd(';', ' ');
            }
            
            return tb;
        }

        protected override IQueryable<EventRequestTable> Filter(IQueryable<EventRequestTable> query, string filterString)
        {
            EventRequestDto filter = GetFilter(filterString);
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
                (string.IsNullOrEmpty(filter.EventName) || x.EventName.ToLower().Contains(filter.EventName.ToLower())) && 
                (string.IsNullOrEmpty(filter.AttendeesString) || x.EventRequestAttendees.Any(x => x.EmployeeName.ToLower().Contains(filter.AttendeesString.ToLower()))) &&
                x.EventStartDate <= filterEndDate && x.EventStartDate >= filterStartDate && 
                (
                    (string.IsNullOrEmpty(filter.AssignedToUpn) || x.AssignedToUpn.Contains(filter.AssignedToUpn))
                    || (filter.AssignedToUpn.ToLower() == "na" && string.IsNullOrEmpty(x.AssignedToUpn))
                ) &&
                (string.IsNullOrEmpty(filter.Status) || x.Status.Contains(filter.Status)));
        }

        private EventRequestDto GetFilter(string filterString)
        {
            var dto = new EventRequestDto();

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
                            case "eventname":
                                dto.EventName = value;
                                break;
                            case "attendeesstring":
                                dto.AttendeesString = value;
                                break;
                            case "datefilter":
                                dto.DateFilter = value;
                                break;
                            case "assignedtoupn":
                                dto.AssignedToUpn = value;
                                break;
                            case "status":
                                dto.Status = value;
                                break;
                        }
                    }
                }
            }

            return dto;
        }

        protected override IQueryable<EventRequestTable> Query()
        {
            return Repository.QueryTable();
        }
    }
}
