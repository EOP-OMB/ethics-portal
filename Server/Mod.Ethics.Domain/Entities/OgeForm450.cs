using Mod.Framework.Domain.Entities.Auditing;
using Mod.Framework.Runtime.Security;
using System;
using System.Collections.Generic;

namespace Mod.Ethics.Domain.Entities
{
    public abstract class OgeForm450Base : FullAuditedEntity
    {
        public string FilerUpn { get; set; }
        public string EmployeesName { get; set; }
        public int Year { get; set; }
        public string ReportingStatus { get; set; }
        public string FormStatus { get; set; }
        public DateTime DueDate { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedToUpn { get; set; }
        public int FormFlags { get; set; }  // 1 - SubmittedPaperCopy, 2 - IsUnchanged
        public int DaysExtended { get; set; }
        public bool HasAssetsOrIncome { get; set; }
        public bool HasSpousePaidEmployment { get; set; }
        public bool HasLiabilities { get; set; }
        public bool HasOutsidePositions { get; set; }
        public bool HasAgreementsOrArrangements { get; set; }
        public bool HasGiftsOrTravelReimbursements { get; set; }

        public string SubstantiveReviewer { get; set; }
        public string SubstantiveReviewerUpn { get; set; }
        public DateTime? DateOfSubstantiveReview { get; set; }
        public string ReviewStatus { get; set; }

        public virtual ICollection<OgeForm450Status> OgeForm450Statuses { get; set; }
    }

    public class OgeForm450 : OgeForm450Base
    {
        public string Title { get; set; }

        // Employee Data, prepopulated from Employee table (but recorded for historical purposes)
        public string EmailAddress { get; set; }
        public string PositionTitle { get; set; }
        public string Agency { get; set; }
        public string BranchUnitAndAddress { get; set; }
        public string WorkPhone { get; set; }
        public DateTime? DateOfAppointment { get; set; }

        public string Grade { get; set; }
        public bool IsSpecialGovernmentEmployee { get; set; }
        public string SgeMailingAddress { get; set; }  // MailingAddress

        
        // Signature Stuff, move to Status Table
        public string CorrelationId { get; set; }
        

        public int AssignedToEmployeeId { get; set; }

        public string CommentsOfReviewingOfficial { get; set; }
        public string PrivateComments { get; set; }

        public virtual ICollection<OgeForm450ReportableInformation> ReportableInformation { get; set; }
        public virtual ICollection<OgeForm450ExtensionRequest> ExtensionRequests { get; set; }
        public bool IsReviewable 
        { 
            get
            {
                return FormStatus == Enumerations.OgeForm450Statuses.SUBMITTED || 
                    FormStatus == Enumerations.OgeForm450Statuses.RE_SUBMITTED ||
                    FormStatus == Enumerations.OgeForm450Statuses.NOT_STARTED || 
                    FormStatus == Enumerations.OgeForm450Statuses.DRAFT ||
                    FormStatus == Enumerations.OgeForm450Statuses.MISSING_INFORMATION ||
                    FormStatus == Enumerations.OgeForm450Statuses.IN_REVIEW ||
                    FormStatus == Enumerations.OgeForm450Statuses.READY_TO_CERT;
            }
        }
    }
}
