import { DtoBase, UserInfo } from "mod-framework";

export class Attendee extends DtoBase {
    constructor(reqId: number) {
        super();
        this.eventRequestId = reqId;

        //this.employee = new UserInfo();
    }

    eventRequestId: number;
    eventName: string = "";
    employee?: UserInfo;
    capacity: string = "";
    employeeType: string = "";
    isGivingRemarks?: boolean;
    remarks: string = "";
    reasonForAttending: string = "";

    // UI Only
    selected: boolean = false;
}
