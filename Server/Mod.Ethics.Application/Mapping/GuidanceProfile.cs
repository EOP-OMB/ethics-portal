using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using System.Linq;

namespace Mod.Ethics.Application.Mapping
{
    public class GuidanceProfile : AutoMapper.Profile
    {
        public GuidanceProfile()
        {
            CreateMap<Guidance, GuidanceDto>();
            CreateMap<GuidanceDto, Guidance>()
                .ForMember(ent => ent.Attachments, src => src.Ignore());
            CreateMap<GuidanceSubject, GuidanceSubjectDto>().ReverseMap();
            CreateMap<GuidanceType, GuidanceTypeDto>().ReverseMap();
        }
    }
}
