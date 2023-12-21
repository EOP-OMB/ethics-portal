using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Enumerations
{
    public static class EventRequestStatus
    {
        public const string DRAFT = "Draft";
        public const string UNASSIGNED = "Open - Unassigned";
        public const string OPEN = "Open";
        public const string CLOSED = "Closed - Other";
        public const string APPROVED = "Closed - Approved";
        public const string CANCELED = "Closed - Canceled";
        public const string WITHDRAWN = "Closed - Withdrawn";
        public const string DENIED = "Closed - Denied";
    }
}
