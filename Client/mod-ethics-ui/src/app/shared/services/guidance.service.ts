import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { Guidance } from '../models/guidance.model';
import { TableData } from '../models/table-data.model';
import { map, Observable } from 'rxjs';

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

    getTable(page: number, pageSize: number, sort: string, sortDirection: string, filter: string): Observable<TableData<Guidance>> {
        const url = `${this.url}/${this.endpoint}/getTable?page=${page}&pageSize=${pageSize}&sort=${sort}&sortDirection=${sortDirection}&filter=${filter}`;

        return this.http.get<TableData<Guidance>>(url).pipe(map((response: TableData<Guidance>) => {
            var data: Guidance[] = [];

            response.data.forEach(x => {
                var obj = this.formatResponse(x);
                data.push(obj);
            });

            response.data = data;

            return response;
        }));
    }
}
