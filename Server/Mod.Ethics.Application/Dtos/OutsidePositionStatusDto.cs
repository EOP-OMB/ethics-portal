using Mod.Framework.Application;

namespace Mod.Ethics.Application.Dtos
{
    public class OutsidePositionStatusDto : AuditedDtoBase
    {
        public string Action { get; set; }
        public string Status { get; set; }
        public string Comment { get; set; }
        public string CreatedByName { get; set; }
    }
}
