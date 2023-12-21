using Microsoft.EntityFrameworkCore;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Ethics.Domain.Views;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.EfCore.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class EventRequestRepository : EfRepositoryBase<EthicsContext, EventRequest>, IEventRequestRepository
    {
        public EventRequestRepository(EthicsContext context) : base(context)
        {
        }

        public override IQueryable<EventRequest> Query()
        {
            return base.Query().Include(x => x.EventRequestAttendees);
        }

        public IQueryable<EventRequestTable> QueryTable()
        {
            var q = QueryIncluding(x => x.EventRequestAttendees).Select(obj => new EventRequestTable
            {
                Id = obj.Id,
                EventName = obj.EventName,
                EventStartDate = obj.EventStartDate,
                EventEndDate = obj.EventEndDate,
                Status = obj.Status,
                AssignedTo = obj.AssignedTo,
                AssignedToUpn = obj.AssignedToUpn,
                AttendeesString = obj.EventRequestAttendees.Select(f => new { AttendeesString = string.Join(", ", f.EmployeeName)}).FirstOrDefault().AttendeesString,
                EventRequestAttendees = obj.EventRequestAttendees,
                SubmittedDate = obj.SubmittedDate
            });

            return q;
        }
    }
}
