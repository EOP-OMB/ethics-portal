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
    public class OgeForm450ExtensionRequestRepository : EfRepositoryBase<EthicsContext, OgeForm450ExtensionRequest>, IOgeForm450ExtensionRequestRepository
    {
        public OgeForm450ExtensionRequestRepository(EthicsContext context) : base(context)
        {
        }
    }
}
