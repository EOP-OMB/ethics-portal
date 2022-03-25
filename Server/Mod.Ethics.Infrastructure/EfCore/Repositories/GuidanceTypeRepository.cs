using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.EfCore.Repositories;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class GuidanceTypeRepository : EfRepositoryBase<EthicsContext, GuidanceType>, IGuidanceTypeRepository
    {
        public GuidanceTypeRepository(EthicsContext context) : base(context)
        {
        }
    }
}
