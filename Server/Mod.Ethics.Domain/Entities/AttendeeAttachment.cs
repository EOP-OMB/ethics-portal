using Mod.Framework.Attachments.Entities;

namespace Mod.Ethics.Domain.Entities
{
    public class AttendeeAttachment : AttachmentBase
    {
        public virtual EventRequestAttendee EventRequestAttendee { get; set; }
        public int? EventRequestAttendeeId { get; set; }
    }
}
