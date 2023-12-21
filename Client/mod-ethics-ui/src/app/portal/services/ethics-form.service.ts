import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { EthicsForm } from '../models/ethics-form.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EthicsFormService extends ModPromiseServiceBase<EthicsForm> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'ethicsform', EthicsForm)
    }

    getFile(id: number) {
        var url = `${this.url}/${this.endpoint}/getfile/${id}`;

        return this.http.get(url, { observe: 'events', responseType: 'blob' })
            .pipe(map((res) => {
                return res;
            }));
    }
}
