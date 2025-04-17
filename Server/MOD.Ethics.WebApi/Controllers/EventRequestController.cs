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
        private EventRequestTableAppService TableService { get; }
        new readonly IEventRequestAppService Service;

        public EventRequestController(ILogger<EventRequestController> logger, IEventRequestAppService service, EventRequestTableAppService tableService) : base(logger, service)
        {
            TableService = tableService;
            Service = service;
        }

        [HttpGet("GetTable")]
        public virtual ActionResult<TableBase<EventRequestDto>> GetTable(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            return TableService.Get(page, pageSize, sort, sortDirection, filter);
        }

        [HttpGet("resendemail/{id}")]
        public virtual ActionResult ResendEmail(int id)
        {
            Service.ResendAssignmentEmail(id);

            return Ok();
        }

        [HttpGet("GetSummary")]
        public virtual ActionResult<EventRequestSummary> GetSummary()
        {
            return Service.GetSummary();
        }

        [HttpGet("GetByEmployee/{upn}")]
        public virtual ActionResult<List<EventRequestDto>> GetByEmployee(string upn)
        {
            return Json(Service.GetByEmployee(upn));
        }

        [HttpGet("GetYearOverYearChart")]
        public virtual ActionResult<EventsRequestChart> GetYearOverYearChart()
        {
            return Service.GetYearOverYearChart();
        }

        [HttpPut("Approve")]
        public virtual ActionResult<EventRequest> Approve([FromBody] ApproveModel model)
        {
            return Json(Service.Approve(model.id, model.comment));
        }

        [HttpPut("Deny")]
        public virtual ActionResult<EventRequest> Deny([FromBody] ApproveModel model)
        {
            return Json(Service.Deny(model.id, model.comment));
        }
    }

    public class ApproveModel
    {
        public int id { get; set; }
        public string comment { get; set; }
    }
}
