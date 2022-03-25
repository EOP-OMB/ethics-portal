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
    public class HelpfulLinkController : CrudControllerBase<HelpfulLinkDto, HelpfulLink>
    {
        public HelpfulLinkController(ILogger<HelpfulLinkController> logger, IHelpfulLinkAppService service) : base(logger, service)
        {
        }
    }
}
