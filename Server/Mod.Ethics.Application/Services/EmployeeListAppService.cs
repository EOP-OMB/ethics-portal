using Microsoft.Extensions.Logging;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Entities;
using Mod.Framework.User.Interfaces;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using Mod.Framework.Runtime.Security;
using Mod.Ethics.Domain.Enumerations;

namespace Mod.Ethics.Application.Services
{
    public class EmployeeListAppService : EmployeeAppServiceBase<EmployeeListDto>, IEmployeeListAppService
    {
        private IApplicationRoles ApplicationRoles { get; set; }

        public EmployeeListAppService(IEmployeeRepository repository, ISettingsAppService settingsService, IOgeForm450Repository formRepository, IApplicationRoles applicationRoles, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session, IDepartmentRepository departmentRepo) : base(repository, settingsService, formRepository, objectMapper, logger, session)
        {
            ApplicationRoles = applicationRoles;
        }

        public override List<EmployeeListDto> GetAll()
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(Employee).Name);
            
            var entities = Repository.GetAllIncluding(w => w.Type != "CONT", x => x.EmployeeAttributes);
            preloadedForms = FormRepository.GetAll();

            var list = entities.Select(Map).ToList();

            return list.Where(x => !string.IsNullOrEmpty(x.FilerType)).OrderBy(x => x.DisplayName).ToList();
        }

        public List<EmployeeListDto> GetAllIncludeInactive()
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(Employee).Name);

            preloadedForms = FormRepository.GetAll();
            var entities = Repository.GetAllNoFilterIncluding(w => w.Type != "CONT", x => x.EmployeeAttributes);

            var list = entities.Select(Map).ToList();

            return list.Where(x => !string.IsNullOrEmpty(x.FilerType)).OrderBy(x => x.DisplayName).ToList();
        }

        public List<EmployeeListDto> GetAllNoFilter()
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(Employee).Name);

            preloadedForms = FormRepository.GetAll();
            var entities = Repository.GetAllNoFilterIncluding(w =>true, x => x.EmployeeAttributes);

            var list = entities.Select(Map).ToList();

            return list.Where(x => !string.IsNullOrEmpty(x.FilerType)).OrderBy(x => x.DisplayName).ToList();
        }

        public override EmployeeListDto Update(EmployeeListDto dto)
        {
            throw new NotSupportedException();
        }
        
        public List<EmployeeListDto> Search(string query)
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(Employee).Name);

            List<Employee> entities;
            List<EmployeeListDto> ftResults = null;

            if (!string.IsNullOrEmpty(query))
            {
                var phoneSearch = query.Replace("-", "").Replace("(", "").Replace(")", "").Replace(" ", "");
                entities = Repository.GetAllIncluding(x => x.GivenName.Contains(query) ||
                x.Surname.Contains(query) ||
                x.Title.Contains(query) ||
                x.OfficePhone.Contains(phoneSearch) ||
                x.MobilePhone.Contains(phoneSearch) ||
                x.Department != null && x.Department.Name.Contains(query), y => y.EmployeeAttributes);

                ftResults = GetFullTextResults(query);
            }
            else
            {
                entities = Repository.GetAllIncluding(x => x.EmployeeAttributes, y => y.Department);
            }

            var list = entities.Select(MapToDto).OrderBy(x => x.SortOrder).ToList();

            if (ftResults != null)
                list.AddRange(ftResults);

            list = list.Where(x => !string.IsNullOrEmpty(x.FilerType)).GroupBy(x => x.Id).Select(x => x.First()).ToList();

            return list;
        }

        private List<EmployeeListDto> GetFullTextResults(string query)
        {
            List<EmployeeListDto> ftResults;

            try
            {
                ftResults = FreeTextSearch(query);
            }
            catch
            {
                var tempEntities = Repository.GetAll(x => x.DisplayName.Contains(query));

                ftResults = tempEntities.Select(MapToDto).ToList();
            }

            return ftResults;
        }

        private List<EmployeeListDto> FreeTextSearch(string query)
        {
            var ftResults = (Repository as IEmployeeRepository).FreeTextSearch(query);

            return ftResults.Select(MapToDto).ToList();
        }

        public List<EmployeeListDto> GetReviewers()
        {
            var reviewerGroups = ApplicationRoles.GetRoleGroups(Roles.OGEReviewer);

            var reviewers = Repository.GetAllInGroups(reviewerGroups);

            return reviewers.Select(MapToDto).ToList();
        }

        public List<EmployeeListDto> GetEventReviewers()
        {
            var reviewerGroups = ApplicationRoles.GetRoleGroups(Roles.EventReviewer);

            var reviewers = Repository.GetAllInGroups(reviewerGroups);

            return reviewers.Select(MapToDto).ToList();
        }

        public List<EmployeeListDto> GetByDepartment(int departmentId)
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(Employee).Name);

            var entities = Repository.GetAll(x => x.DepartmentId == departmentId);

            var list = entities.Select(MapToDto).OrderBy(x => x.SortOrder).ToList();

            return list;
        }
    }
}

