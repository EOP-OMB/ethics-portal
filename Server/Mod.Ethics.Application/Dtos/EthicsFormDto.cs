using Mod.Framework.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class EthicsFormDto : DtoBase
    {
        public string Description { get; set; }

        public string FileName { get; set; }

        public int Size { get; set; }
        public string FormType { get; set; }
        public byte[] Content { get; set; }

        public string ContentType { get; set; }

        public int SortOrder { get; set; }
    }
}
