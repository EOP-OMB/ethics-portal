using Mod.Framework.EfCore.Repositories;
using Mod.Framework.Notifications.Domain.Entities;
using Mod.Framework.Notifications.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class NotificationRepository : EfRepositoryBase<EthicsContext, Notification>, INotificationRepository
    {
        public NotificationRepository(EthicsContext context) : base(context)
        {
        }
    }
}
