using Mod.Ethics.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Views
{
    public class OgeForm450Table : OgeForm450Base
    {
        public DateTime? DateSubmitted { get; set; }
        public string FormFlagDescription { get; set; }
    }
}
