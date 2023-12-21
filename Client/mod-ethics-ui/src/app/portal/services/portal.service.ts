import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { PortalData } from '../models/portal-data.model';

@Injectable({
    providedIn: 'root'
})
export class PortalService extends ModPromiseServiceBase<PortalData> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'portal', PortalData)
    }
}
