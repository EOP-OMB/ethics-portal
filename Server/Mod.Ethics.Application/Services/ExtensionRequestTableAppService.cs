using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
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
    public class ExtensionRequestTableAppService : TableAppServiceBase<TableBase<ExtensionRequestDto>, ExtensionRequestDto, OgeForm450ExtensionRequest, ExtensionRequestTable>
    {
        protected new readonly IOgeForm450ExtensionRequestRepository Repository;

        public ExtensionRequestTableAppService(IOgeForm450ExtensionRequestRepository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            Repository = repository;
        }

        protected override ExtensionRequestDto MapToDto(ExtensionRequestTable entity)
        {
            var dto = base.MapToDto(entity);

            return dto;
        }

        protected override ExtensionRequestDto PostMap(ExtensionRequestDto dto)
        {
            return base.PostMap(dto);
        }

        protected override IQueryable<ExtensionRequestTable> Filter(IQueryable<ExtensionRequestTable> query, string filterString)
        {
            ExtensionRequestDto filter = GetFilter(filterString);

            return query.Where(x =>
                (string.IsNullOrEmpty(filter.FilerName) || x.FilerName.ToLower().Contains(filter.FilerName.ToLower())) &&
                (string.IsNullOrEmpty(filter.Year) || x.Year == Convert.ToInt32(filter.Year)) &&
                (string.IsNullOrEmpty(filter.Status) || x.Status.Contains(filter.Status)) &&
                (filter.DaysRequested == 0 || x.DaysRequested == filter.DaysRequested));
        }

        protected override IQueryable<ExtensionRequestTable> Query()
        {
            var q = Repository.QueryTable();

            return q;
        }

        private ExtensionRequestDto GetFilter(string filterString)
        {
            var dto = new ExtensionRequestDto();

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
                            case "filername":
                                dto.FilerName = value;
                                break;
                            case "year":
                                dto.Year = value;
                                break;
                            case "status":
                                dto.Status = value;
                                break;
                            case "daysrequested":
                                dto.DaysRequested = Convert.ToInt32(value);
                                break;
                        }
                    }
                }
            }

            return dto;
        }
    }
}
