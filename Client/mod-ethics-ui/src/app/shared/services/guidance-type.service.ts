import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { GuidanceType } from '../models/guidance-type.model';

@Injectable({
    providedIn: 'root'
})
export class GuidanceTypeService extends ModPromiseServiceBase<GuidanceType> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'guidanceType', GuidanceType)
    }
}
