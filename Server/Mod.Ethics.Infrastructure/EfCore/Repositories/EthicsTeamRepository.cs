﻿using Mod.Ethics.Domain.Entities;
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
    public class EthicsTeamRepository : EfRepositoryBase<EthicsContext, EthicsTeam>, IEthicsTeamRepository
    {
        public EthicsTeamRepository(EthicsContext context) : base(context)
        {
        }
    }
}
