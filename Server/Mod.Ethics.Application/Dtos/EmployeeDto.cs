using Mod.Framework.Application;
using System;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Dtos
{
    public class EmployeeDto : EmployeeDtoBase
    {
        public string AppointmentDate { get; set; }
        public string Notes { get; set; }
        public string Position { get; set; }
        public string Agency { get; set; }
        public string ProfileUrl { get; set; }
        public bool GenerateForm { get; set; }

        public string NewEntrantEmailText { get; set; }
        public string AnnualEmailText { get; set; }

        public EmployeeChildDto ReportsTo { get; set; }

        public List<EmployeeChildDto> DirectReports { get; set; }
    }

    public class EmployeeChildDto : EmployeeDtoBase
    {

    }

    public class EmployeeDtoBase : EmployeeListDtoBase
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Title { get; set; }
        public string Division { get; set; }
        public string Office { get; set; }
        public string OfficePhone { get; set; }
        public string MobilePhone { get; set; }
        public string EmailAddress { get; set; }
        public string Location { get; set; } // StreetAddress
        public string City { get; set; }
        public string State { get; set; }
        public string DepartmentName { get; set; }
        public bool HasImage { get; set; }
        public string ProfileImage { get; set; }
        public string DepartmentOverride { get; set; }

        public string Bio { get; set; }
        public string AppointmentType { get; set; }
        public string AppointmentType2 { get; set; }
        public bool Political { get; set; }
        public int? AnnualSalary { get; set; }
    }

    public class EmployeeListDto : EmployeeListDtoBase
    {

    }

    public class EmployeeListDtoBase : AuditedDtoBase
    {
        public string DisplayName { get; set; }
        public string FilerType { get; set; }
        public string EmployeeStatus { get; set; }
        public string ReportingStatus { get; set; }
        public string CurrentFormStatus { get; set; }
        public DateTime? Last450Date { get; set; }

        public string Type { get; set; }
        public string Subtype { get; set; }

        public string Upn { get; set; }
        public int CurrentFormId { get; set; }
        public string DueDate { get; set; }
        public string SortOrder { get; set; }
        public bool Inactive { get; set; }
        public DateTime? InactiveDate { get; set; }

        public DateTime? HireDate { get; set; }
    }
}
