using Microsoft.AspNetCore.Authorization;
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
    public class AttendeeAttachmentController : AttachmentControllerBase<AttachmentDto, AttendeeAttachment>
    {
        public AttendeeAttachmentController(ILogger<AttendeeAttachmentController> logger, IAttendeeAttachmentAppService service) : base(logger, service)
        {
        }
    }
}
