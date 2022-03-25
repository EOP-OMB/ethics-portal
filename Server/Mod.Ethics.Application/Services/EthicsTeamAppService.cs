﻿using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mod.Ethics.Application.Services
{
    public class EthicsTeamAppService : CrudAppService<EthicsTeamDto, EthicsTeam>, IEthicsTeamAppService
    {
        private IEmployeeRepository EmployeeRepository;

        public EthicsTeamAppService(IEthicsTeamRepository repository, IEmployeeRepository employeeRepo, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            EmployeeRepository = employeeRepo;
        }

        public override List<EthicsTeamDto> GetAll()
        {
            var ethicsTeam = Repository.GetAll();
            var list = new List<EthicsTeamDto>();

            foreach (EthicsTeam et in ethicsTeam)
            {
                var dto = new EthicsTeamDto();

                if (et.Type == (int)EthicsTeamType.Employee)
                {
                    var employee = EmployeeRepository.Get(Convert.ToInt32(et.Value));
                    dto.Branch = employee.Office;
                    dto.CellPhone = employee.MobilePhone;
                    dto.Email = employee.EmailAddress;
                    dto.Id = et.Id;
                    dto.IsUser = true;
                    dto.Org = employee.Company == "OMB" ? "Office of Management and Budget" : employee.Company;
                    dto.Position = employee.Title;
                    dto.SortOrder = et.SortOrder;
                    dto.WorkPhone = employee.OfficePhone;
                    dto.EmployeeId = employee.Id;
                }
                else
                {
                    dto.IsUser = false;
                    dto.Email = et.Value;
                }

                dto.Title = et.Title;   

                list.Add(dto);
            }

            return list.OrderBy(x => x.SortOrder).ToList();
        }

    }
}
