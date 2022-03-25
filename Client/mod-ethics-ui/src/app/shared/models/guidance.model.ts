import { DtoBase } from "mod-framework";
import { Attachment } from "./attachment.model";
import { Employee } from "./employee.model";

// Employee Name, Guidance Type, Subject, Date Given
export class Guidance extends DtoBase {
    constructor() {
        super();
    }

    employeeName: string = "";
    filerType: string = "";
    employeeId: number = 0;
    guidanceType: string = "";
    subject: string = "";
    text: string = "";
    notifyEmployee: boolean = false;
    dateOfGuidance: Date = new Date();
    summary: string = "";
    guid: string = "";
    isShared: boolean = false;

    // client use only
    employee: Employee = new Employee();
    attachments: Attachment[] = [];
}
