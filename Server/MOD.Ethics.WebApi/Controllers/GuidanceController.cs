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
        private GuidanceTableAppService TableService { get; }

        public GuidanceController(ILogger<GuidanceController> logger, IGuidanceAppService service, GuidanceTableAppService tableService) : base(logger, service)
        {
            Service = service;
            TableService = tableService;
        }

        [HttpGet("GetByEmployee/{upn}")]
        public virtual ActionResult<List<GuidanceDto>> GetByEmployee(string upn)
        {
            return Json(Service.GetByEmployee(upn));
        }

        [HttpGet("GetTable")]
        public virtual ActionResult<TableBase<GuidanceDto>> GetTable(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            return TableService.Get(page, pageSize, sort, sortDirection, filter);
        }
    }
}
