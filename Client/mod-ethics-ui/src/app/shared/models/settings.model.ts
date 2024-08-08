import { DtoBase } from "mod-framework";

export class Settings extends DtoBase {
    currentFilingYear: number = 0;
    siteUrl: string = "";
    ogcEmail: string = "";

    formVersion: string = "";
    replacesVersion: string = "";
    minimumGiftValue: number = 0;
    totalGiftValue: number = 0;

    ccEmail: string = "";

    annualDueDate: Date = new Date();

    inMaintMode: Boolean = false;
}


