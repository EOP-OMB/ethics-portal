using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Application.Mapping
{
    public class GuidanceProfile : AutoMapper.Profile
    {
        public GuidanceProfile()
        {
            CreateMap<Guidance, GuidanceDto>().ReverseMap();
            CreateMap<GuidanceSubject, GuidanceSubjectDto>().ReverseMap();
            CreateMap<GuidanceType, GuidanceTypeDto>().ReverseMap();
        }
    }
}
