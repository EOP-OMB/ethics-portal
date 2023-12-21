using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Mod.Framework.EfCore.Repositories;
using System.Linq;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class OutsidePositionRepository : EfRepositoryBase<EthicsContext, OutsidePosition>, IOutsidePositionRepository
    {
        public OutsidePositionRepository(EthicsContext context) : base(context)
        {
        }

        public override OutsidePosition Get(int id)
        {
            return Query().Include(x => x.OutsidePositionStatuses).SingleOrDefault(CreateEqualityExpressionForId(id));
        }

        public IQueryable<OutsidePosition> QueryTable()
        {
            var q = Query();

            return q;
        }
    }
}
