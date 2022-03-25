using Mod.Framework.Domain.Entities.Auditing;
using System;

namespace Mod.Ethics.Domain.Entities
{
    public class Settings : FullAuditedEntity
    {
        public int CurrentFilingYear { get; set; }
        public string SiteUrl { get; set; }
        public string OGCEmail { get; set; }
        public string CcEmail { get; set; }
        public string FormVersion { get; set; }
        public string ReplacesVersion { get; set; }
        public int MinimumGiftValue { get; set; }
        public int TotalGiftValue { get; set; }
        public DateTime AnnualDueDate { get; set; }
        public DateTime LastEmployeeSyncDate { get; set; }
    }
}
