import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Attachment } from '@shared/models/attachment.model';

export abstract class AttachmentServiceBase implements IAttachmentService {
    constructor(public httpClient: HttpClient, public apiDownloadUrl: string) {

    }

    public downloadFile(uid: string): Observable<HttpEvent<Blob>> {
        return this.httpClient.request(new HttpRequest(
            'GET',
            `${this.apiDownloadUrl}/${uid}`,
            null,
            {
                reportProgress: true,
                responseType: 'blob',
                withCredentials: true
            }));
    }
}

export interface IAttachmentService {
    downloadFile(uid: string): Observable<HttpEvent<Blob>>;
}
