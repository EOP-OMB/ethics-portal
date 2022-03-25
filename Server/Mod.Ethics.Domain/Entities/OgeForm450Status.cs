using Mod.Framework.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class OgeForm450Status : AuditedEntity
    {
        public string Status { get; set; }
        public string Comment { get; set; }

        public int OgeForm450Id { get; set; }

        public virtual OgeForm450 OgeForm450 { get; set; }
    }
}
