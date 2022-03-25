using Mod.Framework.Domain.Entities.Auditing;
using Mod.Framework.Runtime.Security;
using System;
using System.Collections.Generic;

namespace Mod.Ethics.Domain.Entities
{
    public class OgeForm450ExtensionRequest : FullAuditedEntity
    {
        public string Reason { get; set; }
        public int DaysRequested { get; set; }
        public string Status { get; set; }
        public string Comments { get; set; }
        public DateTime ExtensionDate { get; set; }

        public int OgeForm450Id { get; set; }
        public virtual OgeForm450 OgeForm450 { get; set; }
    }
}
