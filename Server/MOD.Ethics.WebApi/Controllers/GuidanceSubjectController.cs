using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.WebApi.Controllers;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class GuidanceSubjectController : CrudControllerBase<GuidanceSubjectDto, GuidanceSubject>
    {
        public GuidanceSubjectController(ILogger<GuidanceSubjectController> logger, IGuidanceSubjectAppService service) : base(logger, service)
        {
        }
    }
}
