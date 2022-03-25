import { DtoBase } from "mod-framework";

export class Attachment extends DtoBase {
    uid: string = "";
    name: string = "";
    contentType: string = "";
    type: string = "";
    allowedFileTypes: string[] = [];
    size: number = 0;
    foreignKey: number | null = null;
    attachedToGuid: string = "";
    content: File | undefined;
}
