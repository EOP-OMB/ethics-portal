using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Interfaces;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.WebApi.Controllers;
using System.Collections.Generic;

namespace Mod.Ethics.WebApi.Controllers
{
    public class OutsidePositionController : CrudControllerBase<OutsidePositionDto, OutsidePosition>
    {
        private OutsidePositionTableAppService TableService { get; }
        new readonly IOutsidePositionAppService Service;

        public OutsidePositionController(ILogger<OutsidePositionController> logger, OutsidePositionTableAppService tableService, IOutsidePositionAppService service) : base(logger, service)
        {
            Service = service;
            TableService = tableService;
        }

        [HttpGet("GetByEmployee/{upn}")]
        public virtual ActionResult<List<OutsidePositionDto>> GetByEmployee(string upn)
        {
            return Json(Service.GetByEmployee(upn));
        }

        [HttpPut("submit/{id}")]
        public virtual ActionResult<OutsidePositionDto> Submit(int id, OutsidePositionDto dto)
        {
            return Service.Submit(dto);
        }

        [HttpGet("GetTable")]
        public virtual ActionResult<TableBase<OutsidePositionDto>> GetTable(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            return TableService.Get(page, pageSize, sort, sortDirection, filter);
        }

        [HttpGet("GetSummary")]
        public virtual ActionResult<OutsidePositionSummary> GetSummary()
        {
            return Json(Service.GetSummary());
        }

        [HttpPut("approve/{id}")]
        public virtual ActionResult<OutsidePositionDto> Approve(int id, OutsidePositionDto dto)
        {
            return Service.Approve(dto);
        }

        [HttpPut("disapprove/{id}")]
        public virtual ActionResult<OutsidePositionDto> Disapprove(int id, OutsidePositionDto dto)
        {
            return Service.Disapprove(dto);
        }

        [HttpPut("cancelrequest/{id}")]
        public virtual ActionResult<OutsidePositionDto> CancelRequest(int id, OutsidePositionDto dto)
        {
            return Service.Cancel(dto);
        }
    }
}
