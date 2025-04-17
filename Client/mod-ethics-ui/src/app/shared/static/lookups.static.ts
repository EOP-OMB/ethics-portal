import { SelectItem } from "../models/select-item.interface";
import { DetaileeType } from "./detailee-type.const";
import { EmployeeSubtype } from "./employee-subtype.const";
import { EmployeeType } from "./employee-type.const";
import { ExtensionStatus } from "./extension-status.const";
import { FilerTypes } from "./filer-types.const";
import { FormFlags } from "./form-flags.const";
import { FormStatus } from "./form-status.const";
import { RecipientTypes } from "../components/notification-template-edit/recipient-types.const";
import { ReportingStatus } from "./reporting-status.const";
import { EventStatus } from "./event-status.const";
import { TrainingTypes } from "./training-types.const";
import { WorkTypes } from "./work-types.const";
import { OutsidePositionStatuses } from "./outside-position-statuses.const";

export class Lookups {
    public static YEARS: SelectItem[] = [];
    public static EXTENSION_STATUSES: SelectItem[] = [];
    public static FILER_TYPES: SelectItem[] = [];
    public static DETAILEE_TYPE: SelectItem[] = [];
    public static REPORTING_STATUSES: SelectItem[] = [];
    public static FORM_STATUSES: SelectItem[] = [];
    public static RECIPIENT_TYPES: SelectItem[] = [];
    public static DIVISIONS: SelectItem[] = [];
    public static FORM_FLAGS: SelectItem[] = [];
    public static EMPLOYEE_TYPES: SelectItem[] = [];
    public static EMPLOYEE_SUBTYPES: SelectItem[] = [];
    public static EVENT_STATUSES: SelectItem[] = [];
    public static TRAINING_TYPES: SelectItem[] = [];
    public static WORK_TYPES: SelectItem[] = [];
    public static OUTSIDE_POSITION_STATUSES: SelectItem[] = [];

    public static initialize() {
        Lookups.YEARS = [];

        var year = new Date().getFullYear();

        for (var i = year; i >= year - 5; i--) {
            Lookups.YEARS.push({ text: i.toString(), value: i.toString(), group: "" });
        }

        Lookups.WORK_TYPES = [];
        Lookups.WORK_TYPES.push({ value: WorkTypes.Professional, text: "Professional or Consultative Activity", group: '' });
        Lookups.WORK_TYPES.push({ value: WorkTypes.OfficialDuties, text: "Teaching, Speaking, Writing or Editing related to official duties", group: '' });
        Lookups.WORK_TYPES.push({ value: WorkTypes.BoardService, text: "Board Service", group: '' });
        Lookups.WORK_TYPES.push({ value: WorkTypes.Volunteer, text: "Volunteer", group: '' });
        Lookups.WORK_TYPES.push({ value: WorkTypes.ExpertWitness, text: "Expert Witness", group: '' });
        Lookups.WORK_TYPES.push({ value: WorkTypes.SelfEmployment, text: "Self-Employment", group: '' });
        Lookups.WORK_TYPES.push({ value: WorkTypes.SalariedEmployee, text: "Salaried or Hourly Employee", group: '' });
        Lookups.WORK_TYPES.push({ value: WorkTypes.Other, text: "Other (please explain in Additional Remarks)", group: '' });

        Lookups.EVENT_STATUSES = [];
        Lookups.EVENT_STATUSES.push({ text: EventStatus.DRAFT, value: EventStatus.DRAFT, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.UNASSIGNED, value: EventStatus.UNASSIGNED, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.ALL_OPEN, value: EventStatus.ALL_OPEN, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.OPEN_COMMS, value: EventStatus.OPEN_COMMS, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.OPEN, value: EventStatus.OPEN, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.CLOSED, value: EventStatus.CLOSED, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.APPROVED, value: EventStatus.APPROVED, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.CANCELED, value: EventStatus.CANCELED, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.WITHDRAWN, value: EventStatus.WITHDRAWN, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.DENIED, value: EventStatus.DENIED, group: '' });
        Lookups.EVENT_STATUSES.push({ text: EventStatus.DENIED_COMMS, value: EventStatus.DENIED_COMMS, group: '' });

        Lookups.FORM_FLAGS = [];
        Lookups.FORM_FLAGS.push({ text: FormFlags.EXTENDED, value: FormFlags.EXTENDED, group: "" });
        Lookups.FORM_FLAGS.push({ text: FormFlags.BLANK_SUBMISSION, value: FormFlags.BLANK_SUBMISSION, group: "" });
        Lookups.FORM_FLAGS.push({ text: FormFlags.PAPER_COPY, value: FormFlags.PAPER_COPY, group: "" });
        Lookups.FORM_FLAGS.push({ text: FormFlags.OVERDUE, value: FormFlags.OVERDUE, group: "" });
        Lookups.FORM_FLAGS.push({ text: FormFlags.UNCHANGED, value: FormFlags.UNCHANGED, group: "" });

        Lookups.EXTENSION_STATUSES = [];
        Lookups.EXTENSION_STATUSES.push({ text: 'All', value: null, group: "" });
        Lookups.EXTENSION_STATUSES.push({ text: ExtensionStatus.PENDING, value: ExtensionStatus.PENDING, group: "" });
        Lookups.EXTENSION_STATUSES.push({ text: ExtensionStatus.REJECTED, value: ExtensionStatus.REJECTED, group: "" });
        Lookups.EXTENSION_STATUSES.push({ text: ExtensionStatus.APPROVED, value: ExtensionStatus.APPROVED, group: "" });
        Lookups.EXTENSION_STATUSES.push({ text: ExtensionStatus.CANCELED, value: ExtensionStatus.CANCELED, group: "" });

        Lookups.FILER_TYPES = [];
        Lookups.FILER_TYPES.push({ text: FilerTypes.NOT_ASSIGNED, value: FilerTypes.NOT_ASSIGNED, group: "" });
        Lookups.FILER_TYPES.push({ text: FilerTypes.FORM_450_FILER, value: FilerTypes.FORM_450_FILER, group: "" });
        Lookups.FILER_TYPES.push({ text: FilerTypes.FORM_278_FILER, value: FilerTypes.FORM_278_FILER, group: "" });
        Lookups.FILER_TYPES.push({ text: FilerTypes.NON_FILER, value: FilerTypes.NON_FILER, group: "" });
        Lookups.FILER_TYPES.push({ text: FilerTypes._450_WAIVED, value: FilerTypes._450_WAIVED, group: "" });

        Lookups.DETAILEE_TYPE = [];
        Lookups.DETAILEE_TYPE.push({ text: DetaileeType.DETAILEE, value: DetaileeType.DETAILEE, group: "" });
        Lookups.DETAILEE_TYPE.push({ text: DetaileeType.IPA, value: DetaileeType.IPA, group: "" });

        Lookups.REPORTING_STATUSES = [];
        Lookups.REPORTING_STATUSES.push({ text: ReportingStatus.NEW_ENTRANT, value: ReportingStatus.NEW_ENTRANT, group: "" });
        Lookups.REPORTING_STATUSES.push({ text: ReportingStatus.ANNUAL, value: ReportingStatus.ANNUAL, group: "" });

        Lookups.FORM_STATUSES = [];
        Lookups.FORM_STATUSES.push({ text: FormStatus.NOT_AVAILABLE, value: FormStatus.NOT_AVAILABLE, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.NOT_STARTED, value: FormStatus.NOT_STARTED, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.DRAFT, value: FormStatus.DRAFT, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.SUBMITTED, value: FormStatus.SUBMITTED, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.MISSING_INFORMATION, value: FormStatus.MISSING_INFORMATION, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.RE_SUBMITTED, value: FormStatus.RE_SUBMITTED, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.IN_REVIEW, value: FormStatus.IN_REVIEW, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.READY_TO_CERT, value: FormStatus.READY_TO_CERT, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.CERTIFIED, value: FormStatus.CERTIFIED, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.DECLINED, value: FormStatus.DECLINED, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.CANCELED, value: FormStatus.CANCELED, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.EXPIRED, value: FormStatus.EXPIRED, group: "" });

        Lookups.RECIPIENT_TYPES = [];
        Lookups.RECIPIENT_TYPES.push({ text: RecipientTypes.USER, value: 0, group: "" });
        Lookups.RECIPIENT_TYPES.push({ text: RecipientTypes.GROUP, value: 1, group: "" });
        Lookups.RECIPIENT_TYPES.push({ text: RecipientTypes.ROLE, value: 2, group: "" });

        Lookups.EMPLOYEE_TYPES = [];
        Lookups.EMPLOYEE_TYPES.push({ text: EmployeeType.POLITICAL, value: EmployeeType.POLITICAL, group: "" });
        Lookups.EMPLOYEE_TYPES.push({ text: EmployeeType.CAREER, value: EmployeeType.CAREER, group: "" });

        Lookups.EMPLOYEE_SUBTYPES = [];
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.PAS, value: EmployeeSubtype.PAS, group: EmployeeType.POLITICAL });
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.PA, value: EmployeeSubtype.PA, group: EmployeeType.POLITICAL });
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.NC_SES_SL, value: EmployeeSubtype.NC_SES_SL, group: EmployeeType.POLITICAL });
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.NC_GS, value: EmployeeSubtype.NC_GS, group: EmployeeType.POLITICAL });
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.SES_SL, value: EmployeeSubtype.SES_SL, group: EmployeeType.CAREER });
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.GS, value: EmployeeSubtype.GS, group: EmployeeType.CAREER });
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.GS_INTER_CSULT, value: EmployeeSubtype.GS_INTER_CSULT, group: EmployeeType.CAREER });
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.GS_SGE, value: EmployeeSubtype.GS_SGE, group: EmployeeType.CAREER });
        Lookups.EMPLOYEE_SUBTYPES.push({ text: EmployeeSubtype.GS_INTERN, value: EmployeeSubtype.GS_INTERN, group: EmployeeType.CAREER });

        Lookups.TRAINING_TYPES = [];
        Lookups.TRAINING_TYPES.push({ text: TrainingTypes.ANNUAL, value: TrainingTypes.ANNUAL, group: "" });
        Lookups.TRAINING_TYPES.push({ text: TrainingTypes.INITIAL, value: TrainingTypes.INITIAL, group: "" });

        Lookups.OUTSIDE_POSITION_STATUSES = [];
        Lookups.OUTSIDE_POSITION_STATUSES.push({ text: OutsidePositionStatuses.DRAFT, value: OutsidePositionStatuses.DRAFT, group: '' });
        Lookups.OUTSIDE_POSITION_STATUSES.push({ text: OutsidePositionStatuses.AWAITING_MANAGER, value: OutsidePositionStatuses.AWAITING_MANAGER, group: '' });
        Lookups.OUTSIDE_POSITION_STATUSES.push({ text: OutsidePositionStatuses.AWAITING_ETHICS, value: OutsidePositionStatuses.AWAITING_ETHICS, group: '' });
        Lookups.OUTSIDE_POSITION_STATUSES.push({ text: OutsidePositionStatuses.APPROVED, value: OutsidePositionStatuses.APPROVED, group: '' });
        Lookups.OUTSIDE_POSITION_STATUSES.push({ text: OutsidePositionStatuses.DISAPPROVED, value: OutsidePositionStatuses.DISAPPROVED, group: '' });
        Lookups.OUTSIDE_POSITION_STATUSES.push({ text: OutsidePositionStatuses.CANCELED, value: OutsidePositionStatuses.CANCELED, group: '' });
    }
}
Lookups.initialize();
