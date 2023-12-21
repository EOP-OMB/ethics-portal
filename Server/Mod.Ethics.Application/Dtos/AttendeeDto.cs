using Mod.Framework.Application;
using Mod.Framework.Attachments.Dtos;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Dtos
{
    public class AttendeeDto : DtoBase
    {
        public int EventRequestId { get; set; }

        public string Capacity { get; set; }
        public EmployeeDto Employee { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeUpn { get; set; }
        public string EmployeeType { get; set; }
        public bool? InformedSupervisor { get; set; }
        public bool? IsGivingRemarks { get; set; }
        public string ReasonForAttending { get; set; }
        public string Remarks { get; set; }
        
        public string NameOfSupervisor { get; set; }

        public bool? IsSpeakerAgreementRequired { get; set; }
        public string AttachmentGuid { get; set; }

        public bool IsDeleted { get; set; }

        public List<AttachmentDto> AttendeeAttachments { get; set; }
    }
}
