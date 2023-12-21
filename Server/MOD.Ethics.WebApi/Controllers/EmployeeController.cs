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
    public class EmployeeController : CrudControllerBase<EmployeeDto, Employee>
    {
        new readonly IEmployeeAppService Service;

        public EmployeeController(ILogger<EmployeeController> logger, IEmployeeAppService service) : base(logger, service)
        {
            Service = service;
        }

        [HttpGet("GetByUpn/{upn}")]
        public virtual ActionResult<EmployeeDto> GetByUpn(string upn)
        {
            var emp = Service.GetByUpn(upn);

            return Json(emp);
        }

        [HttpGet("Sync")]
        public virtual ActionResult Sync()
        {
            Service.Sync();
            
            return Ok();
        }

        [HttpGet("MyProfile")]
        public virtual ActionResult<EmployeeDto> MyProfile()
        {
            var emp = Service.GetMyProfile();

            return Json(emp);
        }

        [HttpGet("Image/{id}")]
        public virtual ActionResult<string> Image(int id)
        {
            var image = Service.GetProfileImage(id);

            var obj = new
            {
                Id = id,
                Data = image
            };

            return Json(obj);
        }

        [HttpGet("Search/{term}")]
        public virtual ActionResult<EmployeeDto[]> Search(string term)
        {
            var results = Service.Search(term);

            return Json(results);
        }
    }
}
