using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.WebApi.Controllers;
using System.Collections.Generic;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class GuidanceController : CrudControllerBase<GuidanceDto, Guidance>
    {
        new readonly IGuidanceAppService Service;

        public GuidanceController(ILogger<GuidanceController> logger, IGuidanceAppService service) : base(logger, service)
        {
            Service = service;
        }

        [HttpGet("GetByEmployee/{upn}")]
        public virtual ActionResult<List<GuidanceDto>> GetByEmployee(string upn)
        {
            return Json(Service.GetByEmployee(upn));
        }
    }
}
