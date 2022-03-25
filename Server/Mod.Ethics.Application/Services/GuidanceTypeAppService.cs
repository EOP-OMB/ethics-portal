using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.Runtime.Session;
using System.Collections.Generic;
using System.Linq;

namespace Mod.Ethics.Application.Services
{
    public class GuidanceTypeAppService : CrudAppService<GuidanceTypeDto, GuidanceType>, IGuidanceTypeAppService
    {
        public GuidanceTypeAppService(IGuidanceTypeRepository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
        }

        public override IEnumerable<GuidanceTypeDto> GetAll()
        {
            return base.GetAll().OrderBy(x => x.Text);
        }
    }
}
