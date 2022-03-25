
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Attachments.Dtos;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Mapping
{
    public class GuidanceAttachmentProfile : AutoMapper.Profile
    {
        public GuidanceAttachmentProfile()
        {
            CreateMap<GuidanceAttachment, AttachmentDto>();

            CreateMap<AttachmentDto, GuidanceAttachment>()
                .ForMember(ga => ga.GuidanceId, opt => opt.MapFrom(src => src.ForeignKey));
        }
    }
}
