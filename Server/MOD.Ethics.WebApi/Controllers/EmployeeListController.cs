using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.User.Entities;
using Mod.Framework.WebApi.Controllers;
using System.Collections.Generic;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class EmployeeListController : CrudControllerBase<EmployeeListDto, Employee>
    {
        new readonly IEmployeeListAppService Service;

        public EmployeeListController(ILogger<EmployeeListController> logger, IEmployeeListAppService service) : base(logger, service)
        {
            Service = service;
        }

        [HttpGet("Reviewers")]
        public virtual ActionResult<List<EmployeeListDto>> Reviewers()
        {
            return Service.GetReviewers();
        }

        [HttpGet("EventReviewers")]
        public virtual ActionResult<List<EmployeeListDto>> EventReviewers()
        {
            return Service.GetEventReviewers();
        }

        [HttpGet("IncludeInactive")]
        public virtual ActionResult<List<EmployeeListDto>> IncludeInactive()
        {
            return Service.GetAllIncludeInactive();
        }
    }
}
