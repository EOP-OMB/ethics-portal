using Mod.Framework.Domain.Entities.Auditing;
using System.Collections.Generic;

namespace Mod.Ethics.Domain.Entities
{
    public class EventRequestAttendee : FullAuditedEntity
    {
        public int EventRequestId { get; set; }
        public virtual EventRequest EventRequest { get; set; }

        public string EmployeeName { get; set; }
        public string EmployeeUpn { get; set; }
        public string EmployeeType { get; set; }
        public string Capacity { get; set; }
        public bool? IsGivingRemarks { get; set; }
        public bool? InformedSupervisor { get; set; }
        public string NameOfSupervisor { get; set; }
        public string ReasonForAttending { get; set; }
        public string Remarks { get; set; }

        public bool? IsSpeakerAgreementRequired { get; set; }

        public string AttachmentGuid { get; set; }

        public virtual ICollection<AttendeeAttachment> AttendeeAttachments { get; set; }

    }
}
