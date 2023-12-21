import { DtoBase } from "mod-framework";

export class EthicsTeam extends DtoBase {
    name: string = "";
    title: string = "";
    org: string = "";
    branch: string = "";
    email: string = "";
    workPhone: string = "";
    cellPhone: string = "";
    isUser: boolean = true;
    employeeId: number = 0;
    sortOrder: number = 0;
}
