using Mod.Framework.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class TrainingDto : AuditedDtoBase
    {
        public DateTime DateAndTime { get; set; }
        public string Location { get; set; }
        public string EthicsOfficial { get; set; }
        public string Employee { get; set; }
        public string EmployeesName { get; set; }
        public int Year { get; set; }
        public string TrainingType { get; set; }
        public string Division { get; set; }
        public bool Inactive { get; set; }
    }
}
