using Mod.Framework.Domain.Entities;
using Mod.Framework.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class EthicsTeam : FullAuditedEntity
    {
        public int Type { get; set; }
        public string Title { get; set; }
        public string Value { get; set; }
        public int SortOrder { get; set; }
    }
}
