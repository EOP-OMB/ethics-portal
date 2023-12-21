using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.WebApi.Controllers;
using System.Collections.Generic;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class ExtensionRequestController : CrudControllerBase<ExtensionRequestDto, OgeForm450ExtensionRequest>
    {
        new readonly IExtensionRequestAppService Service;
        private ExtensionRequestTableAppService TableService { get; }

        public ExtensionRequestController(ILogger<ExtensionRequestController> logger, IExtensionRequestAppService service, ExtensionRequestTableAppService tableService) : base(logger, service)
        {
            Service = service;
            TableService = tableService;
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
            var obj = Service.GetPending();

            return Json(obj);
        }

        [HttpGet("GetTable")]
        public virtual ActionResult<TableBase<ExtensionRequestDto>> GetTable(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            return TableService.Get(page, pageSize, sort, sortDirection, filter);
        }
    }
}
