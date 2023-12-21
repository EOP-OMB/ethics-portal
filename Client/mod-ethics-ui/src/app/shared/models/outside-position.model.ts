import { DtoBase } from "mod-framework";
import { Helper } from "../static/helper.funcs";
import { Lookups } from "../static/lookups.static";
import { OutsidePositionStatuses } from "../static/outside-position-statuses.const";
import { Employee } from "./employee.model";
import { Attachment } from "./attachment.model";
import { OutsidePositionStatus } from "./outside-position-status.model";

export class OutsidePosition extends DtoBase {
    constructor() {
        super();
    }

    // Section 1
    employeeName: string;
    employeeUpn: string;
    employeePhone: number | null;
    employeeEmail: string;
    title: string;
    annualSalary: number | null;
    filerType: string;
    departmentName: string;

    // Secion 2
    poc: string;
    pocPhone: number | null;
    pocEmail: string;
    positionTitle: string;
    periodsOfEmployment: string;   // days per week, hours per day
    physicalLocation: string;
    isPaid: boolean | null;
    methodOfCompensation: string;   // Fee, Honorarium, Salary, Royalty, Retainer, etc.
    startDate: Date;
    endDate: Date | null;
    typeOfWork: number = 0;             // Nature of Outside Position
    duties: string;
    isLikeOfficialDuties: boolean;
    relationshipToDuties: string;   // if isLikeOfficialDuties then required
    requiresAbsence: boolean | null;
    involveExpense: boolean | null;
    useOfFacilities: boolean | null;
    requireDutiesContract: boolean | null;
    requiresDutiesFederal: boolean | null;
    involveOfficialTitle: boolean | null;
    involveDutiesSales: boolean | null;
    involveOrg: boolean | null;

    // Secion 3
    employeeSignature: string;
    submittedDate: Date | null;
    status: string;                 // Submitted, Supervisor Approved, Ethics Approved

    // Section 4
    supervisor: Employee;
    supervisorName: string;
    supervisorUpn: string;
    disapproveReason: string;
    
    // Section 6 (Previously 7)
    additionalRemarks: string;

    attachmentGuid: string;

    outsidePositionAttachments: Attachment[] = [];
    outsidePositionStatuses: OutsidePositionStatus[] = [];

    guidance: string;
    organizationName: string;

    get positionDates(): string {
        var eventDates = "";

        var eventDates = Helper.formatDate(this.startDate);

        if (this.endDate && this.endDate != this.startDate)
            eventDates += ' - ' + Helper.formatDate(this.endDate);

        return eventDates;
    }

    get hasAttachments(): boolean {
        return this.outsidePositionAttachments.length > 0;
    }

    getTypeOfWorkDescription(): string {
        var workTypes = "";

        Lookups.WORK_TYPES.forEach(x => {
            if ((x.value & this.typeOfWork) == x.value)
                workTypes += x.text + '; ';

            if (workTypes.length > 2)
                workTypes = workTypes.substring(0, workTypes.length - 2);
        });

        return workTypes;
    }

    get nextApprover(): string {
        if (this.status == OutsidePositionStatuses.AWAITING_ETHICS)
            return 'Ethics';
        else if (this.status == OutsidePositionStatuses.AWAITING_MANAGER)
            return this.supervisorName;
        else
            return "";
    }
}
