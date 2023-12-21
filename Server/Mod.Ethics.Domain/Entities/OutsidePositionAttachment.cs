using Mod.Framework.Attachments.Entities;

namespace Mod.Ethics.Domain.Entities
{
    public class OutsidePositionAttachment : AttachmentBase
    {
        public virtual OutsidePosition OutsidePosition { get; set; }
        public int? OutsidePositionId { get; set; }
    }
}
