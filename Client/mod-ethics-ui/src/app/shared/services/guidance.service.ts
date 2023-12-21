import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { Guidance } from '../models/guidance.model';

@Injectable({
    providedIn: 'root'
})
export class GuidanceService extends ModPromiseServiceBase<Guidance> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'guidance', Guidance)
    }

    public getByEmployee(upn: string): Promise<Guidance[]> {
        var url = `${this.url}/${this.endpoint}/getByEmployee/${upn}`;

        return this.getAllByUrl(url);
    }

    private getAllByUrl(url: string): Promise<Guidance[]> {
        return this.http
            .get<Guidance[]>(url)
            .toPromise()
            .then((response: Guidance[]) => {
                var data: Guidance[] = [];

                response.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                return data;
            })
            .catch(this.handleError);
    }
}
