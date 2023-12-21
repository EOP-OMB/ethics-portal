using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Application.Mapping
{
    public class EthicsPortalProfile : AutoMapper.Profile
    {
        public EthicsPortalProfile()
        {
            CreateMap<HelpfulLink, HelpfulLinkDto>().ReverseMap();
            CreateMap<EthicsForm, EthicsFormDto>().ReverseMap();
            CreateMap<EthicsTeam, EthicsTeamDto>().ReverseMap();
        }
    }
}
