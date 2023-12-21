using Mod.Framework.Application;
using Mod.Framework.User.Entities;
using Mod.Ethics.Application.Dtos;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Mod.Ethics.Application.Services
{
    public interface IEmployeeListAppService : ICrudAppService<EmployeeListDto, Employee>
    {
        List<EmployeeListDto> GetByDepartment(int departmentId);

        List<EmployeeListDto> Search(string query);

        List<EmployeeListDto> GetReviewers();
        List<EmployeeListDto> GetEventReviewers();
        List<EmployeeListDto> GetAllIncludeInactive();
        List<EmployeeListDto> GetAllNoFilter();
    }
}