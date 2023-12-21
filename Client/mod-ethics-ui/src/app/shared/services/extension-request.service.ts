import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModPromiseServiceBase } from 'mod-framework';
import { environment } from '@src/environments/environment';
import { ExtensionRequest } from '../models/extension-request.model';
import { Observable } from 'rxjs';
import { TableData } from '../models/table-data.model';
import { EventRequestSummary } from '../models/event-request-summary.model';

@Injectable({
    providedIn: 'root'
})
export class ExtensionRequestService extends ModPromiseServiceBase<ExtensionRequest> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'extensionrequest', ExtensionRequest)
    }

    getPending(): Promise<ExtensionRequest[]> {
        var url = `${this.url}/${this.endpoint}/pending`;

        return this.getAllByUrl(url);
    }

    private getAllByUrl(url: string): Promise<ExtensionRequest[]> {
        return this.http
            .get<ExtensionRequest[]>(url)
            .toPromise()
            .then((response: ExtensionRequest[]) => {
                var data: ExtensionRequest[] = [];

                response.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                return data;
            })
            .catch(this.handleError);
    }

    getTable(page: number, pageSize: number, sort: string, sortDirection: string, filter: string): Observable<TableData<ExtensionRequest>> {
        const url = `${this.url}/${this.endpoint}/getTable?page=${page}&pageSize=${pageSize}&sort=${sort}&sortDirection=${sortDirection}&filter=${filter}`;

        return this.http.get<TableData<ExtensionRequest>>(url);
    }
}
