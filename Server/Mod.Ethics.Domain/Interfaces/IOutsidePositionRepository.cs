using Mod.Ethics.Domain.Entities;
using Mod.Framework.Domain.Repositories;
using System.Linq;

namespace Mod.Ethics.Domain.Interfaces
{
    public interface IOutsidePositionRepository : IRepository<OutsidePosition>
    {
        IQueryable<OutsidePosition> QueryTable();
    }
}
