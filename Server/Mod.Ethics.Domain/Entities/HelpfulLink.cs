using Mod.Framework.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class HelpfulLink : FullAuditedEntity
    {
        public string Url { get; set; }
        public string Description { get; set; } 
    }
}
