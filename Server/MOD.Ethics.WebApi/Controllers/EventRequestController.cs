using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.WebApi.Controllers;
using System.Collections.Generic;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class EventRequestController : CrudControllerBase<EventRequestDto, EventRequest>
    {
        public EventRequestController(ILogger<EventRequestController> logger, IEventRequestAppService service) : base(logger, service)
        {

        }

        [HttpGet("MyEvents")]
        public virtual ActionResult<List<EventRequestDto>> MyEvents()
        {
            return StatusCode(501);
        }

        [HttpGet("OpenEvents")]
        public virtual ActionResult<List<EventRequestDto>> OpenEvents()
        {
            return StatusCode(501);
        }

        [HttpGet("resendemail/{id}")]
        public virtual ActionResult ResendEmail(int id)
        {
            return StatusCode(501);
        }
    }
}
