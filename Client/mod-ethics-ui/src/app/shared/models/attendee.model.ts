import { DtoBase, UserInfo } from "mod-framework";
import { Employee } from "./employee.model";
import { Guid } from "./guid.static";
import { Attachment } from "./attachment.model";

export class Attendee extends DtoBase {
    constructor(parentId: number) {
        super();

        this.eventRequestId = parentId;
        this.id = 0;

        this.attendeeAttachments = [];
        this.attachmentGuid = Guid.newGuid();
    }

    eventRequestId: number;
    capacity: string;
    employee: Employee = new Employee();
    employeeName: string;
    employeeUpn: string;
    employeeType: string;
    informedSupervisor: boolean;
    isGivingRemarks: boolean;
    nameOfSupervisor: string;
    reasonForAttending: string;
    remarks: string;

    isSpeakerAgreementRequired: boolean;
    attendeeAttachments: Attachment[];
    attachmentGuid: string;

    // client only
    result: string;
}

