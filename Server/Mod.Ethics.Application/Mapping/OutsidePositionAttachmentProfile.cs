
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Attachments.Dtos;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Mapping
{
    public class OutsidePositionAttachmentProfile : AutoMapper.Profile
    {
        public OutsidePositionAttachmentProfile()
        {
            CreateMap<OutsidePositionAttachment, AttachmentDto>()
                .ForMember(ea => ea.Type, opt => opt.MapFrom(src => src.AttachmentType)); 

            CreateMap<AttachmentDto, OutsidePositionAttachment>()
                .ForMember(ea => ea.OutsidePositionId, opt => opt.MapFrom(src => src.ForeignKey))
                .ForMember(ea => ea.AttachmentType, opt => opt.MapFrom(src => src.Type));
        }
    }
}
