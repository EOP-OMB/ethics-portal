using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.User.Entities;
using System;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Services
{
    public interface IOgeForm450AppService : ICrudAppService<OgeForm450Dto, OgeForm450>, IEmailData<OgeForm450Dto>
    {
        OgeForm450Dto GetCurrentForm();
        IEnumerable<OgeForm450Dto> CertifyForms(string flag);
        IEnumerable<OgeForm450Dto> GetMyForms();
        OgeForm450Dto GetPreviousForm(int id);
        IEnumerable<OgeForm450Dto> GetReviewableForms();
        OgeForm450Dto GenerateNewForm(EmployeeDto emp, DateTime dueDate, int year, OgeForm450 previousForm = null);
        void Extend(ExtensionRequestDto extension);
        IEnumerable<OgeForm450Dto> GetFormsByEmployee(int employeeId);
    }
}
