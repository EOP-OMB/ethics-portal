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
    public class EthicsFormController : CrudControllerBase<EthicsFormDto, EthicsForm>
    {
        public EthicsFormController(ILogger<EthicsFormController> logger, IEthicsFormAppService service) : base(logger, service)
        {
        }

        [HttpGet("getfile/{id}")]
        public IActionResult GetFile(int id)
        {
            var file = Service.Get(id);

            return File(file.Bytes, file.ContentType, file.Filename);
        }
    }
}
