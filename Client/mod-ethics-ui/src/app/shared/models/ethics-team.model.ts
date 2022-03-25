import { DtoBase } from "mod-framework";

export class EthicsTeam extends DtoBase {
    title: string = "";
    position: string = "";
    org: string = "";
    branch: string = "";
    email: string = "";
    workPhone: string = "";
    cellPhone: string = "";
    isUser: boolean = true;
    employeeId: number = 0;
}
