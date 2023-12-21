using Mod.Framework.Attachments.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class EventRequestAttachment : AttachmentBase
    {
        public virtual EventRequest EventRequest { get; set; }
        public int? EventRequestId { get; set; }
    }
}
