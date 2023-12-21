using Mod.Framework.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class EthicsTeamDto : DtoBase
    {
        public string Title { get; set; }
        public string Org { get; set; }
        public string Branch { get; set; }
        public string Email { get; set; }
        public string WorkPhone { get; set; }
        public string CellPhone { get; set; }
        public bool IsUser { get; set; }
        public int SortOrder { get; set; }
        public int EmployeeId { get; set; }
        public string Name { get; set; }
    }
}
