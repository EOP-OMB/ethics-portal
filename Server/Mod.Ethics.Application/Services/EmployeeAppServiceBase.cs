using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Entities;
using Mod.Framework.User.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Services
{
    public class EmployeeAppServiceBase<TDto> : CrudAppService<TDto, Employee> where TDto : EmployeeListDtoBase
    {
        protected new IEmployeeRepository Repository { get; set; }
        protected ISettingsAppService SettingsService { get; set; }

        protected IOgeForm450Repository FormRepository { get; set; }

        protected List<OgeForm450> preloadedForms { get; set; }

        public EmployeeAppServiceBase(IEmployeeRepository repository, ISettingsAppService settingsService, IOgeForm450Repository formRepository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            Repository = repository;
            FormRepository = formRepository;
            SettingsService = settingsService;
        }

        protected OgeForm450 GetCurrentForm(EmployeeListDtoBase dto)
        {
            OgeForm450 currentForm;

            if (preloadedForms != null)
            {
                currentForm = preloadedForms.Where(x => x.FilerUpn.ToLower() == dto.Upn.ToLower() && x.FormStatus != OgeForm450Statuses.CANCELED).OrderByDescending(x => x.DueDate).FirstOrDefault();
            }
            else
            {
                currentForm = FormRepository.Query().Where(x => x.FilerUpn.ToLower() == dto.Upn.ToLower() && x.FormStatus != OgeForm450Statuses.CANCELED).OrderByDescending(x => x.DueDate).FirstOrDefault();
            }

            return currentForm;
        }

        protected override TDto PostMap(TDto dto)
        {
            OgeForm450 currentForm = GetCurrentForm(dto);

            GetNotificationText(dto);

            if (currentForm != null)
            {
                dto.CurrentFormId = currentForm.Id;
                dto.CurrentFormStatus = currentForm.FormStatus;
                dto.DueDate = currentForm.DueDate.ToShortDateString();
            }
            else
            {
                dto.CurrentFormId = 0;
                dto.CurrentFormStatus = "Not Available";
            }

            return dto;
        }

        protected virtual void GetNotificationText(TDto dto)
        {

        }
    }
}
