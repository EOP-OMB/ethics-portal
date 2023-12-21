using Mod.Ethics.Domain.Entities;
using Mod.Framework.Attachments.Dtos;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Mapping
{
    public class AttendeeAttachmentProfile : AutoMapper.Profile
    {
        public AttendeeAttachmentProfile()
        {
            CreateMap<AttendeeAttachment, AttachmentDto>()
                .ForMember(ea => ea.Type, opt => opt.MapFrom(src => src.AttachmentType));

            CreateMap<AttachmentDto, AttendeeAttachment>()
                .ForMember(ea => ea.EventRequestAttendeeId, opt => opt.MapFrom(src => src.ForeignKey))
                .ForMember(ea => ea.AttachmentType, opt => opt.MapFrom(src => src.Type));
        }
    }
}
