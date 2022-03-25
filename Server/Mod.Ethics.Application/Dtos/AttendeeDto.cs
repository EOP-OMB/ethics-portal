using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class AttendeeDto
    {
        public int EventRequestId { get; set; }
        public string EventName { get; set; }

        public string Capacity { get; set; }
        public string EmployeeType { get; set; }
        public bool IsGivingRemarks { get; set; }
        public string Remarks { get; set; }
        public string ReasonForAttending { get; set; }

        public EmployeeDto Employee { get; set; }

        public bool InformedSupervisor { get; set; }
        public string NameOfSupervisor { get; set; }
    }
}
