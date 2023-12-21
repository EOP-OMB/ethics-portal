using Mod.Ethics.Application.Dtos;
using Mod.Framework.Application;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Services
{
    public interface IPortalAppService : IAppService
    {
        PortalDto Get();
    }
}
