using Mod.Framework.Domain.Entities.Auditing;

namespace Mod.Ethics.Domain.Entities
{
    public class OutsidePositionStatus : AuditedEntity
    {
        public string Action { get; set; }
        public string Status { get; set; }
        public string Comment { get; set; }

        public int OutsidePositionId { get; set; }

        public virtual OutsidePosition OutsidePosition { get; set; }
    }
}