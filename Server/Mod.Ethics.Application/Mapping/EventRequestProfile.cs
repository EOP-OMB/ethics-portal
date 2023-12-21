using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Views;

namespace Mod.Ethics.Application.Mapping
{
    public class EventRequestProfile : AutoMapper.Profile
    {
        public EventRequestProfile()
        {
            CreateMap<EventRequest, EventRequestDto>();
            CreateMap<EventRequestDto, EventRequest>().ForMember(dto => dto.EventRequestAttachments, opt => opt.Ignore());
            CreateMap<EventRequestAttendee, AttendeeDto>().ReverseMap();
            CreateMap<EventRequestTable, EventRequestDto>().ForMember(dto => dto.AttendeesString, opt => opt.MapFrom(src => src.AttendeesString));
        }
    }
}
