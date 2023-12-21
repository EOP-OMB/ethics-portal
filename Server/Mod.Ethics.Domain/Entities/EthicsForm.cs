using Mod.Framework.Domain.Entities;
using Mod.Framework.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Entities
{
    public class EthicsForm : FullAuditedEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Filename { get; set; }
        public string ContentType { get; set; }
        public string FormType { get; set; }  // Guidance or Form
        public int FileSize { get; set; }
        public byte[] Content { get; set; }
        public int SortOrder { get; set; }
    }
}
