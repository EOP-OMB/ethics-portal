using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Constants
{
    public static class DateFilter
    {
        public static readonly string All = "all";  
        public static readonly string Past = "past";
        public static readonly string Next7Days = "next7";
        public static readonly string Between7And30 = "7to30";
        public static readonly string MoreThan30 = "30plus";
    }
}
