using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Application.Mapping
{
    public class OutsidePositionProfile : AutoMapper.Profile
    {
        public OutsidePositionProfile()
        {
            CreateMap<OutsidePosition, OutsidePositionDto>();
            CreateMap<OutsidePositionDto, OutsidePosition>()
                .ForMember(ent => ent.OutsidePositionStatuses, src => src.Ignore())
                .ForMember(op => op.OutsidePositionAttachments, opt => opt.Ignore());
            CreateMap<OutsidePositionStatus, OutsidePositionStatusDto>().ReverseMap();
        }
    }
}
