
using Mod.Framework.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class GuidanceTypeDto : AuditedDtoBase
    {
        public string Text { get; set; }
    }
}
