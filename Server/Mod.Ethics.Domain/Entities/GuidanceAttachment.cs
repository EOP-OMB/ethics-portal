using Mod.Framework.Attachments.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class GuidanceAttachment : AttachmentBase
    {
        public int? GuidanceId { get; set; }
        public virtual Guidance Guidance { get; set; }
    }
}
