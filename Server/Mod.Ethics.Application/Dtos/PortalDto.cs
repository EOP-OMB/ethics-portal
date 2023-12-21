using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class PortalDto
    {
        public int Id { get; set; }
        public string Current450Status { get; set; }
        public bool IsOverdue { get; set; }
        public int CurrentTrainingId { get; set; }
        public int PendingEvents { get; set; }
        public int PendingPositions { get; set; }
    }
}
