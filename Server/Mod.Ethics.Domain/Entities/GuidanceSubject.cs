using Mod.Framework.Domain.Entities.Auditing;

namespace Mod.Ethics.Domain.Entities
{
    public class GuidanceSubject : FullAuditedEntity
    {
        public string Text { get; set; }
    }
}
