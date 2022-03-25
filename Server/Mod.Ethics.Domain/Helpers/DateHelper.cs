using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Helpers
{
    public static class DateHelper
    {
        public static DateTime GetNextBusinessDay(DateTime dt, int days)
        {
            var tmp = dt.AddDays(days);

            while (tmp.DayOfWeek == DayOfWeek.Saturday || tmp.DayOfWeek == DayOfWeek.Sunday)
                tmp = tmp.AddDays(1);

            return tmp;
        }

        public static bool CompareDate(DateTime date, DateTime checkDate, int addDays = 0)
        {
            var compareDate = checkDate.AddDays(addDays);

            return (date.Date == compareDate.Date);
        }
    }
}
