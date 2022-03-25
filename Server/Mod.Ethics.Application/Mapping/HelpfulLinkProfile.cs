using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Application.Mapping
{
    public class HelpfulLinkProfile : AutoMapper.Profile
    {
        public HelpfulLinkProfile()
        {
            CreateMap<HelpfulLink, HelpfulLinkDto>().ReverseMap();
        }
    }
}
