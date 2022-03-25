import { DtoBase } from "mod-framework";

export class EthicsForm extends DtoBase {
    constructor() {
        super();
        this.id = 0;
    }

    url: string = "";
    doctype: string = "";
    formType: string = ""; // Form or Guidance
    title: string = "";
    modifiedBy: string = "";
    modified: Date = new Date();
    description: string = "";
}
