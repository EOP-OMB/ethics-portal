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
    public class OgeForm450Controller : CrudControllerBase<OgeForm450Dto, OgeForm450>
    {
        new readonly IOgeForm450AppService Service;

        public OgeForm450Controller(ILogger<OgeForm450Controller> logger, IOgeForm450AppService service) : base(logger, service)
        {
            Service = service;
        }

        [HttpGet("GetByYear")]
        public virtual ActionResult<List<OgeForm450Dto>> GetByYear(int year)
        {
            var list = Service.GetBy(x => x.Year == year);

            return Json(list);
        }

        [HttpGet("MyCurrent")]
        public virtual ActionResult<OgeForm450Dto> MyCurrent()
        {
            var obj = Service.GetCurrentForm();

            return Json(obj);
        }

        [HttpGet("Previous/{id}")]
        public virtual ActionResult<OgeForm450Dto> Previous(int id)
        {   
            var obj = Service.GetPreviousForm(id);

            return Json(obj);
        }

        [HttpGet("Reviewer")]
        public virtual ActionResult<List<OgeForm450Dto>> Reviewer()
        {
            var obj = Service.GetReviewableForms();

            return Json(obj);
        }

        [HttpGet("MyForms")]
        public virtual ActionResult<OgeForm450Dto> MyForms()
        {
            var obj = Service.GetMyForms();

            return Json(obj);
        }

        [HttpGet("GetFormsByEmployee/{employeeId}")]
        public virtual ActionResult<OgeForm450Dto> GetFormsByEmployee(int employeeId)
        {
            var obj = Service.GetFormsByEmployee(employeeId);

            return Json(obj);
        }

        [HttpGet("Certify")]
        public virtual ActionResult<OgeForm450Dto> Certify(string a)
        {
            var obj = Service.CertifyForms(a);

            return Json(obj);
        }
    }
}
