using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.WebApi.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class TrainingController : CrudControllerBase<TrainingDto, Training>
    {
        private TrainingTableAppService TableService { get; }
        new readonly ITrainingAppService Service;

        public TrainingController(ILogger<TrainingController> logger, ITrainingAppService service, TrainingTableAppService tableService) : base(logger, service)
        {
            TableService = tableService;
            Service = service;
        }

        [HttpGet("MyTraining")]
        public virtual ActionResult<List<TrainingDto>> MyTraining()
        {
            var list = Service.GetMyTraining();

            return Json(list);
        }

        [HttpGet("CurrentYear")]
        public virtual ActionResult<List<TrainingDto>> CurrentYear()
        {
            return StatusCode(501);
        }

        [HttpGet("GetChart/{year}")]
        public virtual ActionResult<TrainingChart> GetChart(int year)
        {
            return Service.GetChart(year);
        }

        [HttpGet("GetTable")]
        public virtual ActionResult<TableBase<TrainingDto>> GetTable(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            return TableService.Get(page, pageSize, sort, sortDirection, filter);
        }

        [HttpGet("MissingTrainingReport/{year}")]
        public IActionResult MissingTrainingReport(int year)
        {
            var stream = Service.GetMissingTrainingReport(year);
            var filename = year.ToString() + " Missing Annual Training Report.csv";

            return File(stream, "text/csv", filename);
        }

        [HttpGet("MissingInitialTrainingReport")]
        public IActionResult MissingInitialTrainingReport(int year, int days)
        {
            var stream = Service.GetMissingInitialTrainingReport(year, days);
            var filename = year.ToString() + " Missing Initial Training Report.csv";

            return File(stream, "text/csv", filename);
        }

        [HttpGet("GetByUpn/{upn}")]
        public ActionResult<TrainingDto> GetByUpn(string upn)
        {
            var list = Service.GetBy(x => x.EmployeeUpn.ToLower() == upn.ToLower()).ToList();

            return Json(list);
        }
    }
}
