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
    public class TrainingController : CrudControllerBase<TrainingDto, Training>
    {
        public TrainingController(ILogger<TrainingController> logger, ITrainingAppService service) : base(logger, service)
        {
        }

        [HttpGet("MyTraining")]
        public virtual ActionResult<List<TrainingDto>> MyTraining()
        {
            return StatusCode(501);
        }

        [HttpGet("CurrentYear")]
        public virtual ActionResult<List<TrainingDto>> CurrentYear()
        {
            return StatusCode(501);
        }
    }
}
