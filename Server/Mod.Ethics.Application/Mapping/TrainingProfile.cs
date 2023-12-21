using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Application.Mapping
{
    public class TrainingProfile : AutoMapper.Profile
    {
        public TrainingProfile()
        {
            CreateMap<Training, TrainingDto>().ReverseMap();
        }
    }
}
