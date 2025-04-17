
namespace Mod.Ethics.Application.Constants
{
    public static class Roles
    {
        public static readonly string EthicsAppAdmin = "Admin";             // Super Admin, can perform all tasks in all modules OGE 450, Events, Training, Guidance
        public static readonly string OGEReviewer = "OGEReviewer";          // Can Certify/Reject OGE Form 450s
        public static readonly string OGESupport = "OGESupport";   // Can perform most Admin functionality for OGE 450 except changing settings and Certifying/Rejecting Forms
        public static readonly string EventReviewer = "EventReviewer";
        public static readonly string FOIA = "FOIA";
        public static readonly string EventCOMMS = "EventCOMMS";
    }
}
