import { DtoBase } from "mod-framework";

export class Training extends DtoBase {
    employeeStatus: string = "";
    employeeName: string = "";
    employeeUpn: string = "";
    ethicsOfficial: string = "";
    location: string = "";
    trainingDate: Date = null;
    trainingType: string = "";
    year?: number = null;
    
}


