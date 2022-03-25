import { DtoBase } from "mod-framework";
import { OgeForm450 } from "./oge-form-450.model";

export class ExtensionRequest extends DtoBase {
    year: number = 0;
    filerName: string = "";
    created: Date = new Date();

    ogeForm450Id: number = 0;
    reason: string = "";
    daysRequested: number = 0;
    status: string = "";
    extensionDate: Date | null = null;
    reviewerComments: string = "";

    dueDate: Date | null = null;

    form: OgeForm450 = new OgeForm450();
}
