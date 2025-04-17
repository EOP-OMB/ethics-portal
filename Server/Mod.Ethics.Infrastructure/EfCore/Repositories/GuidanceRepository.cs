using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Ethics.Domain.Views;
using Mod.Framework.EfCore.Repositories;
using System.Linq;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class GuidanceRepository : EfRepositoryBase<EthicsContext, Guidance>, IGuidanceRepository
    {
        public GuidanceRepository(EthicsContext context) : base(context)
        {
        }

        public IQueryable<Guidance> QueryTable()
        {
            return Query();
        }
    }
}
