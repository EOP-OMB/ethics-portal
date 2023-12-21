using Mod.Framework.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class Training : FullAuditedEntity
    {
        public string EmployeeName { get; set; }
        public string EmployeeUpn { get; set; }
        public string EthicsOfficial { get; set; }
        public string Location { get; set; }
        public DateTime TrainingDate { get; set; }
        public string TrainingType { get; set; }
        public int Year { get; set; }
        public string EmployeeStatus { get; set; }
    }
}
