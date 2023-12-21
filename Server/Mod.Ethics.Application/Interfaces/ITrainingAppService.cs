using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.User.Entities;
using System.Collections.Generic;
using System.IO;

namespace Mod.Ethics.Application.Services
{
    public interface ITrainingAppService : ICrudAppService<TrainingDto, Training>
    {
        List<TrainingDto> GetMyTraining();

        TrainingChart GetChart(int year);

        MemoryStream GetMissingTrainingReport(int year);

        MemoryStream GetMissingInitialTrainingReport(int year, int days);

        void SyncEmployeeStatus(List<Employee> employees);
    }
}
