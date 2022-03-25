using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mod.Ethics.Application.Mapping
{
    public class ExtensionRequestProfile : AutoMapper.Profile
    {
        public ExtensionRequestProfile()
        {
            CreateMap<OgeForm450ExtensionRequest, ExtensionRequestDto>()
                .ForMember(dto => dto.ReviewerComments, opt => opt.MapFrom(src => src.Comments))
                .ForMember(dto => dto.FilerName, opt => opt.MapFrom(src => src.OgeForm450.EmployeesName))
                .ForMember(dto => dto.Year, opt => opt.MapFrom(src => src.OgeForm450.Year))
                .ForMember(dto => dto.DueDate, opt => opt.MapFrom(src => src.OgeForm450.DueDate))
                .ForMember(dto => dto.Form, opt => opt.MapFrom(src => src.OgeForm450));

            CreateMap<ExtensionRequestDto, OgeForm450ExtensionRequest>()
                .ForMember(src => src.Comments, opt => opt.MapFrom(dto => dto.ReviewerComments));
        }
    }
}
