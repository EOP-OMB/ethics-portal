namespace Mod.Ethics.Domain.Enumerations
{
    public class OutsidePositionStatuses
    {
        public const string DRAFT = "Draft";
        public const string AWAITING_MANAGER = "Awaiting Manager Approval";
        public const string AWAITING_ETHICS = "Awaiting Ethics Approval";
        public const string DISAPPROVED = "Disapproved";
        public const string APPROVED = "Approved";
        public const string CANCELED = "Canceled";
    }

    public class OutsidePositionActions
    {
        public const string SAVED = "Saved";
        public const string SUBMITTED = "Submitted";
        public const string MANAGER_APPROVED = "Manager Approved";
        public const string ETHICS_APPROVED = "Ethics Approved";
        public const string MANAGER_DISAPPROVED = "Manager Disapproved";
        public const string ETHICS_DISAPPROVED = "Ethics Disapproved";
        public const string CANCELED = "Canceled";
    }
}
