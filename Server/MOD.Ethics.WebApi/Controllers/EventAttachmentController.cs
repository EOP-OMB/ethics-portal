using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Attachments.Dtos;
using Mod.Framework.WebApi.Controllers;

namespace Mod.Ethics.WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class EventAttachmentController : AttachmentControllerBase<AttachmentDto, EventRequestAttachment>
    {
        public EventAttachmentController(ILogger<EventAttachmentController> logger, IEventRequestAttachmentAppService service) : base(logger, service)
        {
        }
    }
}
