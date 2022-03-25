import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { EthicsForm } from '../models/ethics-form.model';

@Injectable({
    providedIn: 'root'
})
export class EthicsFormService extends ModPromiseServiceBase<EthicsForm> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'ethicsform', EthicsForm)
    }
}
