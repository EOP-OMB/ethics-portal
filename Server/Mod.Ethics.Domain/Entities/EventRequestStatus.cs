using Mod.Framework.Domain.Entities.Auditing;

namespace Mod.Ethics.Domain.Entities
{
    public class EventRequestStatus : AuditedEntity
    {
        public string Status { get; set; }
        public string Comment { get; set; }

        public int EventRequestId { get; set; }

        public virtual EventRequest EventRequest { get; set; }
    }
}
