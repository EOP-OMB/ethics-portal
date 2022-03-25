using Mod.Framework.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class SettingsDto : AuditedDtoBase
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
