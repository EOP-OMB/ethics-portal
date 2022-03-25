using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;

namespace Mod.Ethics.Application.Services
{
    public interface IEthicsTeamAppService : ICrudAppService<EthicsTeamDto, EthicsTeam>
    {
    }
}
