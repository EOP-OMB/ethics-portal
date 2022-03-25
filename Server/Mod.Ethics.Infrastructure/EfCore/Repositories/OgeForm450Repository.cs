using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
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
    public class OgeForm450Repository : EfRepositoryBase<EthicsContext, OgeForm450>, IOgeForm450Repository
    {
        public OgeForm450Repository(EthicsContext context) : base(context)
        {
        }

        public OgeForm450 GetPreviousForm(int year, string upn)
        {
            return QueryIncluding(x => x.ReportableInformation, y => y.OgeForm450Statuses)
                .Where(x => x.Year == year - 1 && x.FilerUpn.ToLower() == upn.ToLower() && x.FormStatus != OgeForm450Statuses.CANCELED)
                .OrderByDescending(x => x.DueDate)
                .FirstOrDefault();
        }
    }
}
