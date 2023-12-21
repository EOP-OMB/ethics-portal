using Mod.Framework.Application;
using Mod.Framework.Attachments.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class OutsidePositionDto : AuditedDtoBase
    {
        public string EmployeeName { get; set; }
        public string EmployeeUpn { get; set; }
        public long? EmployeePhone { get; set; }
        public string EmployeeEmail { get; set; }
        public string Title { get; set; }
        public string Grade { get; set; }
        public string AnnualSalary { get; set; }
        public string FilerType { get; set; }
        public string DepartmentName { get; set; }
        public string Poc { get; set; }
        public long? PocPhone { get; set; }
        public string PocEmail { get; set; }
        public string PositionTitle { get; set; }
        public string PeriodsOfEmployment { get; set; }   // days per week, hours per day
        public string PhysicalLocation { get; set; }
        public bool? IsPaid { get; set; }
        public string MethodOfCompensation { get; set; }   // Fee, Honorarium, Salary, Royalty, Retainer, etc.
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int TypeOfWork { get; set; }             // Nature of Outside Position
        public string Duties { get; set; }
        public bool? IsLikeOfficialDuties { get; set; }
        public string RelationshipToDuties { get; set; }   // if isLikeOfficialDuties then required
        public bool? RequiresAbsence { get; set; }
        public bool? InvolveExpense { get; set; }
        public bool? UseOfFacilities { get; set; }
        public bool? RequireDutiesContract { get; set; }
        public bool? RequiresDutiesFederal { get; set; }
        public bool? InvolveOfficialTitle { get; set; }
        public bool? InvolveDutiesSales { get; set; }
        public bool? InvolveOrg { get; set; }
        public string EmployeeSignature { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public string Status { get; set; }                 // Submitted, Supervisor Approved, Ethics Approved
        public string SupervisorName { get; set; }
        public string SupervisorUpn { get; set; }
        public string DisapproveReason { get; set; }

        public string EthicsOfficial { get; set; }
        public string AdditionalRemarks { get; set; }
        public string AttachmentGuid { get; set; }
        public string Guidance { get; set; }   

        public string OrganizationName { get; set; }

        public EmployeeDto Supervisor { get; set; }
        public List<OutsidePositionStatusDto> OutsidePositionStatuses { get; set; }
        public List<AttachmentDto> OutsidePositionAttachments { get; set; }
    }
}
