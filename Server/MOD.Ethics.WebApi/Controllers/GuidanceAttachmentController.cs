using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Attachments.Entities;
using Mod.Framework.Attachments.Dtos;
using Mod.Framework.Attachments.Services;
using System.Collections.Generic;
using System.IO;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Mod.Ethics.Application.Services;
using Mod.Framework.WebApi.Controllers;

namespace Mod.Ethics.WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class GuidanceAttachmentController : AttachmentControllerBase<AttachmentDto, GuidanceAttachment>
    {
        public GuidanceAttachmentController(ILogger<GuidanceAttachmentController> logger, IGuidanceAttachmentAppService service) : base(logger, service)
        {
        }
    }
}
