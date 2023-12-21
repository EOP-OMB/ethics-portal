import { DtoBase } from "mod-framework";

export class EthicsForm extends DtoBase {
    constructor() {
        super();
        this.id = 0;
    }

    name: string = '';
    description: string = '';
    filename: string = '';
    contentType: string = '';
    formType: string = ''; // Guidance or Form
    fileSize: number = 0;
    sortOrder: number = 0;
}
