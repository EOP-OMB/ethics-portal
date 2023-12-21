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
        public int Type { get; set; }  // User or Mailbox
        public string Name { get; set; }
        public string Value { get; set; } // When User, value = upn, when Mailbox value = Email Address
        public int SortOrder { get; set; }
    }
}
