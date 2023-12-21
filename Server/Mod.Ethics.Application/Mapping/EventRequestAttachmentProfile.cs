
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Attachments.Dtos;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Mapping
{
    public class EventRequestAttachmentProfile : AutoMapper.Profile
    {
        public EventRequestAttachmentProfile()
        {
            CreateMap<EventRequestAttachment, AttachmentDto>()
                .ForMember(ea => ea.Type, opt => opt.MapFrom(src => src.AttachmentType)); 

            CreateMap<AttachmentDto, EventRequestAttachment>()
                .ForMember(ea => ea.EventRequestId, opt => opt.MapFrom(src => src.ForeignKey))
                .ForMember(ea => ea.AttachmentType, opt => opt.MapFrom(src => src.Type));
        }
    }
}
