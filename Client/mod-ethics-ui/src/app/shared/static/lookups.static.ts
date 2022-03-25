import { SelectItem } from "../models/select-item.interface";
import { DetaileeType } from "./detailee-type.const";
import { EmployeeSubtype } from "./employee-subtype.const";
import { EmployeeType } from "./employee-type.const";
import { ExtensionStatus } from "./extension-status.const";
import { FilerTypes } from "./filer-types.const";
import { FormFlags } from "./form-flags.const";
import { FormStatus } from "./form-status.const";
import { ReportingStatus } from "./reporting-status.const";

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

    public static initialize() {
        Lookups.YEARS = [];

        var year = new Date().getFullYear();

        for (var i = year; i >= year - 5; i--) {
            Lookups.YEARS.push({ text: i.toString(), value: i.toString(), group: "" });
        }

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
        Lookups.FORM_STATUSES.push({ text: FormStatus.CERTIFIED, value: FormStatus.CERTIFIED, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.CANCELED, value: FormStatus.CANCELED, group: "" });
        Lookups.FORM_STATUSES.push({ text: FormStatus.EXPIRED, value: FormStatus.EXPIRED, group: "" });

        //Lookups.RECIPIENT_TYPES = [];
        //Lookups.RECIPIENT_TYPES.push({ label: RecipientTypes.USER, value: RecipientTypes.USER });
        //Lookups.RECIPIENT_TYPES.push({ label: RecipientTypes.GROUP, value: RecipientTypes.GROUP });

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
        
    }
}
Lookups.initialize();
