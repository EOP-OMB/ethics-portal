using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.EfCore.Repositories;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class GuidanceRepository : EfRepositoryBase<EthicsContext, Guidance>, IGuidanceRepository
    {
        public GuidanceRepository(EthicsContext context) : base(context)
        {
        }
    }
}
