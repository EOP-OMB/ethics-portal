import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModPromiseServiceBase } from 'mod-framework';
import { environment } from '../../../environments/environment';
import { HelpfulLink } from '../models/helpful-link.model';

@Injectable({
  providedIn: 'root'
})
export class HelpfulLinksService extends ModPromiseServiceBase<HelpfulLink> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'helpfullink', HelpfulLink)
    }
}
