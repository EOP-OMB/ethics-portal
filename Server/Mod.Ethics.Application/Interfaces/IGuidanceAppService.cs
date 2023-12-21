using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Services
{
    public interface IGuidanceAppService : ICrudAppService<GuidanceDto, Guidance>
    {
        IEnumerable<GuidanceDto> GetByEmployee(string employeeUpn);
    }
}
