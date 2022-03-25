import { DtoBase } from "mod-framework";

export class Training extends DtoBase {
    employee: string = "";
    employeesName: string = "";
    title: string = "";
    dateAndTime: string = "";
    location: string = "";
    ethicsOfficial: string = "";
    division: string = "";
    trainingType: string = "";
    year?: number;
    inactive: boolean = false;
}


