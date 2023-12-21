using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Services;
using Mod.Framework.Notifications;
using Mod.Framework.Notifications.Domain.Entities;
using Mod.Framework.WebApi.Controllers;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class NotificationTemplateController : CrudControllerBase<NotificationTemplateDto, NotificationTemplate>
    {
        public NotificationTemplateController(ILogger<NotificationTemplateController> logger, EthicsNotificationTemplateAppService service) : base(logger, service)
        {
        }
    }
}
