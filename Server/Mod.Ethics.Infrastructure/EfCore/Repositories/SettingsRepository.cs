using Microsoft.Extensions.Caching.Distributed;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.EfCore.Repositories;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class SettingsRepository : CachedRepositoryBase<EthicsContext, Settings>, ISettingsRepository
    {
        public SettingsRepository(IDistributedCache cache, EthicsContext context) : base(cache, context)
        {
        }
    }
}
