using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Views;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.EfCore.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class OgeForm450ExtensionRequestRepository : EfRepositoryBase<EthicsContext, OgeForm450ExtensionRequest>, IOgeForm450ExtensionRequestRepository
    {
        public OgeForm450ExtensionRequestRepository(EthicsContext context) : base(context)
        {
        }

        public IQueryable<ExtensionRequestTable> QueryTable()
        {
            var q = QueryIncluding(x => x.OgeForm450).Select(obj => new ExtensionRequestTable
            {
                Id = obj.Id,
                FilerName = obj.OgeForm450.EmployeesName,
                //Year = obj.OgeForm450.CreatedTime.Year,
                DaysRequested = obj.DaysRequested,
                Status = obj.Status,
                CreatedTime = obj.CreatedTime,
                DueDate = obj.OgeForm450.DueDate,
                Form = obj.OgeForm450,
                OgeForm450Id = obj.OgeForm450Id,
                Reason = obj.Reason,
                Comments = obj.Comments,
                ExtensionDate = obj.ExtensionDate
            });

            return q;
        }
    }
}
