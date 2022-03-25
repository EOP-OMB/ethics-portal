using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.WebApi.Controllers;
using System.Collections.Generic;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class ExtensionRequestController : CrudControllerBase<ExtensionRequestDto, OgeForm450ExtensionRequest>
    {
        new readonly IExtensionRequestAppService Service;

        public ExtensionRequestController(ILogger<ExtensionRequestController> logger, IExtensionRequestAppService service) : base(logger, service)
        {
            Service = service;
        }

        [HttpGet]
        public override ActionResult<IEnumerable<ExtensionRequestDto>> Get()
        {
            if (User.IsInRole(Roles.EthicsAppAdmin) || User.IsInRole(Roles.OGEReviewer) || User.IsInRole(Roles.OGESupport))
            {
                return base.Get();
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet("pending")]
        public virtual ActionResult<ExtensionRequestDto> Pending()
        {
            if (User.IsInRole(Roles.EthicsAppAdmin) || User.IsInRole(Roles.OGEReviewer) || User.IsInRole(Roles.OGEReviewer) || User.IsInRole(Roles.OGESupport))
            {
                var obj = Service.GetPending();

                return Json(obj);
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
