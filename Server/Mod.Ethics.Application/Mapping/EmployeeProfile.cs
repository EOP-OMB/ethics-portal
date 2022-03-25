using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Enumerations;
using Mod.Framework.User.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Mapping
{
    public class EmployeeProfile : AutoMapper.Profile
    {
        public EmployeeProfile()
        {
            CreateMap<Employee, EmployeeDto>()
                .ForMember(dto => dto.Title, opt => opt.MapFrom(emp => emp.Title.Trim()))
                .ForMember(dto => dto.Position, opt => opt.MapFrom(emp => emp.Title.Trim()))
                .ForMember(dto => dto.AppointmentDate, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.AppointmentDate)))
                .ForMember(dto => dto.ProfileImage, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.ProfileImage)))
                .ForMember(dto => dto.Agency, opt => opt.MapFrom(emp => emp.Dept))
                //.ForMember(dto => dto.Division, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.DepartmentOverride) == null ? emp.Division : emp.GetAttributeValue(EmployeeAttributes.DepartmentOverride)))
                .ForMember(dto => dto.FilerType, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EthicsFilerType)))
                .ForMember(dto => dto.EmployeeStatus, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeStatus)))
                .ForMember(dto => dto.ReportingStatus, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EthicsReportingStatus)))
                .ForMember(dto => dto.Last450Date, opt => opt.MapFrom(emp => SafeConvertToDateTime(emp.GetAttributeValue(EmployeeAttributes.Last450Date))))
                .ForMember(dto => dto.Location, opt => opt.MapFrom(emp => emp.StreetAddress))
                .ForMember(dto => dto.Bio, opt => opt.MapFrom(emp => emp.GetAttributeValue("Bio")))
                .ForMember(dto => dto.Upn, opt => opt.MapFrom(emp => emp.Upn.Trim().ToLower()))
                .ForMember(dto => dto.DepartmentOverride, opt => opt.MapFrom(emp => emp.GetAttributeValue("DepartmentOverride")))
                .ForMember(dto => dto.Type, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeType)))
                .ForMember(dto => dto.Subtype, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeSubtype)));

            CreateMap<Employee, EmployeeChildDto>()
                .ForMember(dto => dto.Title, opt => opt.MapFrom(emp => emp.Title.Trim()))
                //.ForMember(dto => dto.Division, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.DepartmentOverride) == null ? emp.Division : emp.GetAttributeValue(EmployeeAttributes.DepartmentOverride)))
                .ForMember(dto => dto.FilerType, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EthicsFilerType)))
                .ForMember(dto => dto.EmployeeStatus, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeStatus)))
                .ForMember(dto => dto.ReportingStatus, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EthicsReportingStatus)))
                .ForMember(dto => dto.Last450Date, opt => opt.MapFrom(emp => SafeConvertToDateTime(emp.GetAttributeValue(EmployeeAttributes.Last450Date))))
                .ForMember(dto => dto.Location, opt => opt.MapFrom(emp => emp.StreetAddress))
                .ForMember(dto => dto.Bio, opt => opt.MapFrom(emp => emp.GetAttributeValue("Bio")))
                .ForMember(dto => dto.Upn, opt => opt.MapFrom(emp => emp.Upn.Trim().ToLower()))
                .ForMember(dto => dto.DepartmentOverride, opt => opt.MapFrom(emp => emp.GetAttributeValue("DepartmentOverride")))
                .ForMember(dto => dto.Type, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeType)))
                .ForMember(dto => dto.Subtype, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeSubtype)));

            CreateMap<Employee, EmployeeListDto>()
                .ForMember(dto => dto.FilerType, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EthicsFilerType)))
                .ForMember(dto => dto.EmployeeStatus, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeStatus)))
                .ForMember(dto => dto.ReportingStatus, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EthicsReportingStatus)))
                .ForMember(dto => dto.Last450Date, opt => opt.MapFrom(emp => SafeConvertToDateTime(emp.GetAttributeValue(EmployeeAttributes.Last450Date))))
                .ForMember(dto => dto.Type, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeType)))
                .ForMember(dto => dto.Subtype, opt => opt.MapFrom(emp => emp.GetAttributeValue(EmployeeAttributes.EmployeeSubtype)));
        }

        private DateTime? SafeConvertToDateTime(string v)
        {
            DateTime dt;

            if (DateTime.TryParse(v, out dt))
                return dt;
            else
                return null;

        }
    }
}
