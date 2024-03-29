﻿using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Views;
using Mod.Framework.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Interfaces
{
    public interface IEventRequestRepository : IRepository<EventRequest>
    {
        IQueryable<EventRequestTable> QueryTable();
    }
}
