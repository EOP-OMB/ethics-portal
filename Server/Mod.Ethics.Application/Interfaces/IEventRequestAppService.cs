using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Services
{
    public interface IEventRequestAppService : ICrudAppService<EventRequestDto, EventRequest>
    {
        List<EventRequestDto> GetMyEvents();

        EventRequestSummary GetSummary();

        IEnumerable<EventRequestDto> GetByEmployee(string employeeUpn);

        EventsRequestChart GetYearOverYearChart();
        void ResendAssignmentEmail(int id);
    }
}
