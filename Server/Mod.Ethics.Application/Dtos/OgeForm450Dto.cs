using Mod.Framework.Application;
using Mod.Framework.Runtime.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class OgeForm450Dto : AuditedDtoBase
    {
        // Obsolete?  Need to change UI logic to use EIN or UPN and not the SharePoint Identifier
        public string Filer { get; set; }

        // Direct Mappings
        public int Year { get; set; }
        public string ReportingStatus { get; set; }
        public DateTime DueDate { get; set; }
        public string EmployeesName { get; set; }
        public string EmailAddress { get; set; }
        public string PositionTitle { get; set; }
        public string Agency { get; set; }
        public string BranchUnitAndAddress { get; set; }
        public string WorkPhone { get; set; }
        public DateTime? DateOfAppointment { get; set; }
        public string Grade { get; set; }
        public bool IsSpecialGovernmentEmployee { get; set; }
        public bool HasAssetsOrIncome { get; set; }
        public bool HasLiabilities { get; set; }
        public bool HasOutsidePositions { get; set; }
        public bool HasAgreementsOrArrangements { get; set; }
        public bool HasGiftsOrTravelReimbursements { get; set; }
        public int DaysExtended { get; set; }
        public string CorrelationId { get; set; }

        // Needs Work
        public string FormStatus { get; set; }
        public DateTime? DateReceivedByAgency { get; set; }
        public string MailingAddress { get; set; }  // SgeMailingAddress
        public string EmployeeSignature { get; set; }
        public DateTime? DateOfEmployeeSignature { get; set; }
        public string ReviewingOfficialSignature { get; set; }
        public DateTime? DateOfReviewerSignature { get; set; }
        public string CommentsOfReviewingOfficial { get; set; }
        public string ExtendedText { get; set; }
        public Boolean IsOverdue { get; set; }
        public bool IsBlank { get; set; }
        public bool IsUnchanged { get; set; }
        public List<ReportableInformationDto> ReportableInformationList { get; set; }
        public DateTime? DateOfSubstantiveReview { get; set; }
        public string SubstantiveReviewer { get; set; }
        public DateTime? ReSubmittedDate { get; set; }
        public string FormFlags { get; set; }  //Text representation of Flags and other statuses 

        // Inbound Only?
        public bool IsRejected { get; set; }
        public string RejectionNotes { get; set; }
        public bool IsSubmitting { get; set; }
        public bool SubmittedPaperCopy { get; set; }

        // Determine usage?
        // This is private, so presumably was just used internally
        //private List<NotificationsDto> _pendingEmails;
        public string Note { get; set; }
        public string AppUser { get; set; }

        public string AssignedTo { get; set; }
        public int AssignedToEmployeeId { get; set; }

        public DateTime? DateCanceled { get; set; }

        public void ClearEmptyReportableInformation()
        {
            if (this.ReportableInformationList != null)
                this.ReportableInformationList.RemoveAll(x => x.Id == 0 && x.IsEmpty());
        }
    }
}
