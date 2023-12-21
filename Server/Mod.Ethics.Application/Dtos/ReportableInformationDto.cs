using Mod.Framework.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class ReportableInformationDto : AuditedDtoBase
    {
        public ReportableInformationDto()
        {
            Name = "";
            Description = "";
            AdditionalInfo = "";
            NoLongerHeld = false;
        }

        public ReportableInformationDto(string type) : this()
        {
            InfoType = type;
        }

        public int OGEForm450Id { get; set; }
        public string InfoType { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string AdditionalInfo { get; set; }
        public bool NoLongerHeld { get; set; }
        public string CorrelationId { get; set; }
        public bool IsDeleted { get; set; }

        public bool IsEmpty()
        {
            return string.IsNullOrEmpty(AdditionalInfo) && string.IsNullOrEmpty(Name) && string.IsNullOrEmpty(Description);
        }
    }
}
