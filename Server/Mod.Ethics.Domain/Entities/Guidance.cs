using Mod.Framework.Attachments.Entities;
using Mod.Framework.Domain.Entities.Auditing;
using Mod.Framework.User.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class Guidance : FullAuditedEntity
    {
        public int EmployeeId { get; set; }
        public string GuidanceType { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
        public DateTime DateOfGuidance { get; set; }
        public string Summary { get; set; }
        public bool IsShared { get; set; }

        public virtual ICollection<GuidanceAttachment> Attachments { get; set; }

        public Guid Guid { get; set; }
    }
}
