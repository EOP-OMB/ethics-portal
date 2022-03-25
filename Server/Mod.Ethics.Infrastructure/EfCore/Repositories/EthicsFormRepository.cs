using Mod.Ethics.Domain.Entities;
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
    public class EthicsFormRepository : EfRepositoryBase<EthicsContext, EthicsForm>, IEthicsFormRepository
    {
        public EthicsFormRepository(EthicsContext context) : base(context)
        {
        }
    }
}
