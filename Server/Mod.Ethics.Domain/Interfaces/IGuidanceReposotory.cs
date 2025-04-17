using Mod.Ethics.Domain.Entities;
using Mod.Framework.Domain.Repositories;
using System.Linq;

namespace Mod.Ethics.Domain.Interfaces
{
    public interface IGuidanceRepository : IRepository<Guidance>
    {
        IQueryable<Guidance> QueryTable();
    }
}
