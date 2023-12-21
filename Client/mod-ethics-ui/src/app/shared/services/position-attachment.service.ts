import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AttachmentServiceBase } from "./attachment.service";

@Injectable({
    providedIn: 'root'
})
export class PositionAttachmentService extends AttachmentServiceBase {
    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/api/positionAttachment/download');
    }
}
