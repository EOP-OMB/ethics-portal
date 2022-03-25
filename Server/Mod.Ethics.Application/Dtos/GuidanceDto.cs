using Mod.Framework.Application;
using Mod.Framework.Attachments.Dtos;
using System;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Dtos
{
    public class GuidanceDto : AuditedDtoBase
    {
        public int EmployeeId { get; set; }
        public string GuidanceType { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
        public string EmployeeName { get; internal set; }
        public string FilerType { get; internal set; }
        public bool NotifyEmployee { get; set; }
        public DateTime DateOfGuidance { get; set; }
        public string Summary { get; set; }
        public bool IsShared { get; set; }
        public Guid Guid { get; set; }
        public List<AttachmentDto> Attachments { get; set; }
        public EmployeeDto Employee { get; set; }
    }
}
