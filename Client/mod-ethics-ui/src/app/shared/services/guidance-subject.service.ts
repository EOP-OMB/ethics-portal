import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { GuidanceSubject } from '../models/guidance-subject.model';

@Injectable({
    providedIn: 'root'
})
export class GuidanceSubjectService extends ModPromiseServiceBase<GuidanceSubject> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'guidanceSubject', GuidanceSubject)
    }
}
