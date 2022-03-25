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
using System.IO;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class SettingsController : CrudControllerBase<SettingsDto, Settings>
    {
        public new ISettingsAppService Service { get; private set; }
        public IEmployeeAppService EmployeeService { get; private set; }

        public SettingsController(ILogger<SettingsController> logger, ISettingsAppService service, IEmployeeAppService employeeService) : base(logger, service)
        {
            Service = service;
            EmployeeService = employeeService;
        }

        [HttpGet("InitiateAnnualRollover")]
        public ActionResult InitiateAnnualRollover()
        {
            var settings = EmployeeService.InitiateAnnualFiling();

            return Json(settings);
        }
    }
}
