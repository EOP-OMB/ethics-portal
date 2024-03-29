﻿using Microsoft.AspNetCore.Authorization;
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
    public class PortalController : ModControllerBase
    {
        public new IPortalAppService Service { get; set; }

        public PortalController(ILogger<PortalController> logger, IPortalAppService service) : base(logger, service)
        {
            Service = service;
        }

        [HttpGet("{id}")]
        public virtual ActionResult<PortalDto> Get(int id)
        {
            var list = Service.Get();

            return Json(list);
        }
    }
}
