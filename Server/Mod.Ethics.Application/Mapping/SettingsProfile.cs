using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Application.Mapping
{
    public class SettingsProfile : AutoMapper.Profile
    {
        public SettingsProfile()
        {
            CreateMap<Settings, SettingsDto>().ReverseMap();
        }
    }
}
