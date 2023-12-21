using Mod.Framework.Application;
using Mod.Framework.User.Entities;
using Mod.Ethics.Application.Dtos;
using System.Collections.Generic;
using System;

namespace Mod.Ethics.Application.Services
{
    public interface IEmployeeAppService : ICrudAppService<EmployeeDto, Employee>
    {
        string GetProfileImage(int id);
        int Sync();
        EmployeeDto GetMyProfile();
        List<EmployeeDto> Search(string query);
        int CountNoFilerTypes();
        void CreateFormForEmployee(SettingsDto settings, EmployeeDto dto, DateTime? dueDate = null);
        SettingsDto InitiateAnnualFiling();
        //SettingsDto FixAnnualFiling();
        EmployeeDto GetByUpn(string upn);
    }
}
