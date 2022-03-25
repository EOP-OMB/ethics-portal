import { DtoBase } from "mod-framework";

export class ReportableInformation extends DtoBase {
    infoType: string = "";
    name: string = "";
    description: string = "";
    additionalInfo: string = "";
    noLongerHeld: boolean = false;
}
