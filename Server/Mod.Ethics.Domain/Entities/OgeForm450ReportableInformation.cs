using Mod.Framework.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class OgeForm450ReportableInformation : FullAuditedEntity
    {
        public string Type { get; set; }    // InfoType
        public string Name { get; set; }
        public string Description { get; set; }
        public string AdditionalInfo { get; set; }
        public bool NoLongerHeld { get; set; } 

        public int OgeForm450Id { get; set; }
        public virtual OgeForm450 OgeForm450 { get; set; }
    }
}
