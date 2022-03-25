using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.EfCore.Repositories;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class GuidanceSubjectRepository : EfRepositoryBase<EthicsContext, GuidanceSubject>, IGuidanceSubjectRepository
    {
        public GuidanceSubjectRepository(EthicsContext context) : base(context)
        {
        }
    }
}
