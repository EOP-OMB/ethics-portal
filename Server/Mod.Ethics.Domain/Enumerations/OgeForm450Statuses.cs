using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Enumerations
{
    public static class OgeForm450Statuses
    {
        public const string NOT_STARTED = "Not-Started";
        public const string DRAFT = "Draft";
        public const string SUBMITTED = "Submitted";
        public const string MISSING_INFORMATION = "Missing Information";
        public const string RE_SUBMITTED = "Re-submitted";
        public const string CERTIFIED = "Certified";
        public const string CANCELED = "Canceled";
               
        public const string EXPIRED = "Expired";   // All the below should contain this string
        public const string NOT_STARTED_EXPIRED = "Not-Started - Expired";
        public const string DRAFT_EXPIRED = "Draft - Expired";
        public const string SUBMITTED_EXPIRED = "Submitted - Expired";
        public const string MIFSSING_INFORMATION_EXPIRED = "Missing Information - Expired";
        public const string RE_SUBMITTED_EXPIRED = "Re-submitted - Expired";

        //Draft
        //Not-Started
        //Submitted
        //Missing Information
        //Re-submitted
        //Certified
        //Canceled

        //Not-Started - Expired
        //Draft - Expired
        //Submitted - Expired
        //Missing Information - Expired
        //Re-submitted - Expired



    }
}
