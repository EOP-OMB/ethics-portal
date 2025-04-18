﻿using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Views;
using Mod.Framework.Domain.Repositories;
using System.Linq;

namespace Mod.Ethics.Domain.Interfaces
{
    public interface IOgeForm450Repository : IRepository<OgeForm450>
    {
        OgeForm450 GetPreviousForm(string upn);

        OgeForm450 GetLatestForm(string upn);

        IQueryable<OgeForm450Table> QueryTable();
    }
}
