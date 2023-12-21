using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Ethics.Domain.Views;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Runtime.Session;
using System;
using System.Linq;
using System.Runtime.CompilerServices;

namespace Mod.Ethics.Application.Services
{
    public class TrainingTableAppService : TableAppServiceBase<TableBase<TrainingDto>, TrainingDto, Training, Training>
    {
        private new readonly ITrainingRepository Repository;
        public TrainingTableAppService(ITrainingRepository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            Repository = repository;
        }

        public override TableBase<TrainingDto> Get(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            return base.Get(page, pageSize, sort, sortDirection, filter);
        }

        protected override IQueryable<Training> Filter(IQueryable<Training> query, string filterString)
        {
            TrainingDto filter = GetFilter(filterString);

            return query.Where(x =>
                (string.IsNullOrEmpty(filter.EmployeeName) || x.EmployeeName.ToLower().Contains(filter.EmployeeName.ToLower())) &&
                (string.IsNullOrEmpty(filter.TrainingType) || x.TrainingType.ToLower() == filter.TrainingType.ToLower()) &&
                (string.IsNullOrEmpty(filter.EthicsOfficial) || x.EthicsOfficial.ToLower().Contains(filter.EthicsOfficial.ToLower())) &&
                (string.IsNullOrEmpty(filter.Location) || x.Location.ToLower().Contains(filter.Location.ToLower())) &&
                (string.IsNullOrEmpty(filter.EmployeeStatus) || x.EmployeeStatus == filter.EmployeeStatus) &&
                (filter.Year == 0 || x.Year == filter.Year));
        }

        private TrainingDto GetFilter(string filterString)
        {
            var dto = new TrainingDto();

            if (!string.IsNullOrEmpty(filterString))
            {
                var split = filterString.Split(";");

                foreach (string s in split)
                {
                    var keyValue = s.Split('|');

                    if (keyValue.Length > 1)
                    {
                        var key = keyValue[0];
                        var value = keyValue[1];

                        switch (key.ToLower())
                        {
                            case "employeename":
                                dto.EmployeeName = value;
                                break;
                            case "year":
                                dto.Year = Convert.ToInt32(value);
                                break;
                            case "trainingtype":
                                dto.TrainingType = value;
                                break;
                            case "ethicsofficial":
                                dto.EthicsOfficial = value;
                                break;
                            case "location":
                                dto.Location = value;
                                break;
                            case "employeestatus":
                                dto.EmployeeStatus = value;
                                break;
                        }
                    }
                }
            }

            return dto;
        }

        protected override IQueryable<Training> Query()
        {
            return Repository.Query();
        }
    }
}
