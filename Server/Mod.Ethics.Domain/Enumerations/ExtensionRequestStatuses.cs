using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Enumerations
{
    public static class ExtensionRequestStatuses
    {
        public const string PENDING = "Pending";
        public const string APPROVED = "Approved";
        public const string REJECTED = "Rejected";
        public const string CANCELED = "Canceled";
    }
}
