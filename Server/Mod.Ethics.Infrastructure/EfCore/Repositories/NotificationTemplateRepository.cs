using Microsoft.Extensions.Caching.Distributed;
using Mod.Framework.EfCore.Repositories;
using Mod.Framework.Notifications.Domain.Entities;
using Mod.Framework.Notifications.Domain.Interfaces;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class NotificationTemplateRepository : EfRepositoryBase<EthicsContext, NotificationTemplate>, INotificationTemplateRepository
    {
        public NotificationTemplateRepository(EthicsContext context) : base(context)
        {
        }
    }
}
