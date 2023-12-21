using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Ethics.Domain.Views;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.EfCore.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class TrainingRepository : EfRepositoryBase<EthicsContext, Training>, ITrainingRepository
    {
        public TrainingRepository(EthicsContext context) : base(context)
        {
        }

        public IQueryable<Training> QueryTable()
        {
            throw new NotImplementedException();
        }
    }
}
