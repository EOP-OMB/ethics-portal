using Mod.Framework.Application;
using Mod.Framework.Attachments.Dtos;
using Mod.Framework.User.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class EventRequestDto : AuditedDtoBase
    {
        public string SubmittedBy { get; set; }
        public string EventName { get; set; }
        public bool? GuestsInvited { get; set; }
        public DateTime? EventStartDate { get; set; }
        public DateTime? EventEndDate { get; set; }
        public string EventContactName { get; set; }
        public string EventContactPhone { get; set; }
        public string EventContactEmail { get; set; }
        public string IndividualExtendingInvite { get; set; }
        public bool? IsIndividualLobbyist { get; set; }
        public string OrgExtendingInvite { get; set; }
        public bool? IsOrgLobbyist { get; set; }
        public int TypeOfOrg { get; set; }
        public string OrgOther { get; set; }
        public string OrgHostingEvent { get; set; }
        public bool? IsHostLobbyist { get; set; }
        public int TypeOfHost { get; set; }
        public string HostOther { get; set; }
        public bool? IsFundraiser { get; set; }
        public string WhoIsPaying { get; set; }
        public string FairMarketValue { get; set; }
        public bool? RequiresTravel { get; set; }
        public bool? InternationalTravel { get; set; }
        public string AdditionalInformation { get; set; }
        public string EventLocation { get; set; }
        public string CrowdDescription { get; set; }
        public string ApproximateAttendees { get; set; }
        public bool? IsOpenToMedia { get; set; }
        public string GuidanceGiven { get; set; }
        public string Status { get; set; }
        public string ClosedReason { get; set; }
        public string ClosedBy { get; set; }
        public DateTime? ClosedDate { get; set; }
        public string ContactNumber { get; set; }
        public string ContactEmail { get; set; }
        public string ContactComponent { get; set; }

        public string AttachmentGuid { get; set; }

        public string Submitter { get; set; }
        public bool? IsQAndA { get; set; }
        public string ModeratorsAndPanelists { get; set; }

        public string AttendeesString { get; set; }
        public string DateFilter { get; set; }

        public string AssignedTo { get; set; }
        public string AssignedToUpn { get; set; }
        public bool? ReceivedInvitation { get; set; }
        public string WhatIsProvided { get; set; }
        public DateTime? SubmittedDate { get; set; }

        public string ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string CommsComment { get; set; }
        public string Capacity { get; set; }

        public List<AttendeeDto> EventRequestAttendees { get; set; }

        public List<AttachmentDto> EventRequestAttachments { get; set; }

        public List<SelectListDto> Reviewers { get; set; }

    }
}
