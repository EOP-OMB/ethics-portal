﻿using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.EfCore.Repositories;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class HelpfulLinkRepository : EfRepositoryBase<EthicsContext, HelpfulLink>, IHelpfulLinkRepository
    {
        public HelpfulLinkRepository(EthicsContext context) : base(context)
        {
        }
    }
}
