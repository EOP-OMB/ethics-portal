using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Domain.Enumerations
{

    public enum NotificationTypes
    {
        ExtensionRequest = 1,
        ExtensionRecieved = 2,
        ExtensionDecision = 3,
        FormSubmitted = 4,
        FormConfirmation = 5,
        FormCertified = 6,
        FormMissingInformation = 7,
        FormNewAnnual = 8,
        FormNewEntrant = 9,
        FormDueIn3Days = 10,
        FormDueIn7Days = 11,
        EventRequestConfirmation = 12,
        EventRequestSubmitted = 13,
        EventRequestAssigned = 14,
        GuidanceGiven = 15,
        EmployeeSync = 16,
        SyncFailed = 17,
        NotificationError = 18,
        FormOverdue = 19,
        OutsidePositionSubmitted = 20,
        OutsidePositionConfirmation =  21,
        OutsidePositionApproval = 22,
        OutsidePositionEthicsApproval = 23,
        OutsidePositionDisapproved = 24
    }

    public static class NotificationTemplates
    {
        public const string EXTENSION_REQUEST = "Extension Request";
        public const string EXTENSION_RECEIVED = "Extension Received";
        public const string EXTENSION_DECISION = "Extension Decision";
        public const string OGE_FORM_450_SUBMITTED = "OGE Form 450 Submitted";
        public const string OGE_FORM_450_CONFIRMATION = "OGE Form 450 Submission Confirmation";
        public const string OGE_FORM_450_CERTIFIED = "OGE Form 450 Certified";
        public const string OGE_FORM_450_MISSING_INFO = "OGE Form 450 Missing Information";
        public const string OGE_FORM_450_NEW_ANNUAL = "OGE Form 450 New Annual Filing";
        public const string OGE_FORM_450_NEW_ENTRANT = "OGE Form 450 New Entrant Filing";
        public const string OGE_FORM_450_DUE_3_DAYS = "OGE Form 450 Due in 3 Days";
        public const string OGE_FORM_450_DUE_7_DAYS = "OGE Form 450 Due in 7 Days";
        public const string EMPLOYEE_SYNC = "Employee Sync";
        public const string FORM_OVERDUE = "OGE Form 450 Overdue";
    }
}
