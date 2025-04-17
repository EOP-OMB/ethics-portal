import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { EventRequest } from '@shared/models/event-request.model';
import { TableData } from '../models/table-data.model';
import { map, Observable } from 'rxjs';
import { EventRequestSummary } from '../models/event-request-summary.model';
import { EventRequestChart } from '../models/event-request-chart.model';

@Injectable({
    providedIn: 'root'
})
export class EventRequestService extends ModPromiseServiceBase<EventRequest> {
    
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'eventrequest', EventRequest)
    }

    //getMyEvents(): Promise<EventRequest[]> {
    //    var url = `${this.url}/${this.endpoint}/myevents`;

    //    return this.getAllByUrl(url);
    //}

    private getAllByUrl(url: string): Promise<EventRequest[]> {
        return this.http
            .get<EventRequest[]>(url)
            .toPromise()
            .then((response: EventRequest[]) => {
                var data: EventRequest[] = [];

                response.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                return data;
            })
            .catch(this.handleError);
    }

    getAllOpen(): Promise<EventRequest[]> {
        var url = `${this.url}/${this.endpoint}/openevents`;

        return this.getAllByUrl(url);
    }

    getByEmployee(upn: string) {
        var url = `${this.url}/${this.endpoint}/getByEmployee/${upn}`;

        return this.getAllByUrl(url);
    }

    getTable(page: number, pageSize: number, sort: string, sortDirection: string, filter: string): Observable<TableData<EventRequest>> {
        const url = `${this.url}/${this.endpoint}/getTable?page=${page}&pageSize=${pageSize}&sort=${sort}&sortDirection=${sortDirection}&filter=${filter}`;

        return this.http.get<TableData<EventRequest>>(url).pipe(map((response: TableData<EventRequest>) => {
            var data: EventRequest[] = [];

            response.data.forEach(x => {
                var obj = this.formatResponse(x);
                data.push(obj);
            });

            response.data = data;

            return response;
        }));
    }

    resendAssignedToEmail(id: number): Promise<any> {
        var url = `${this.url}/${this.endpoint}/resendemail/${id}`;

        return this.http.get(url)
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    getSummary(): Promise<EventRequestSummary> {
        var url = `${this.url}/${this.endpoint}/getSummary`;

        return this.http
            .get<EventRequestSummary>(url)
            .toPromise()
            .catch(this.handleError);
    }

    formatResponse(data: EventRequest): EventRequest {
        data = super.formatResponse(data);

        data.fairMarketValue = +data.fairMarketValue;

        data.eventStartDate = data.eventStartDate ? new Date(data.eventStartDate) : null;
        data.eventEndDate = data.eventEndDate ? new Date(data.eventEndDate) : null;

        return data;
    }

    getYearOverYearChart() {
        var url = `${this.url}/${this.endpoint}/getYearOverYearChart`;

        return this.http
            .get<EventRequestChart>(url)
            .toPromise()
            .catch(this.handleError);
    }

    approveRequest(eventRequestId: number, comment: string) {
        var url = `${this.url}/${this.endpoint}/approve`;

        return this.http.put(url, { id: eventRequestId, comment: comment})
            .toPromise()
            .then(() => { })
            .catch(this.handleError);
    }

    denyRequest(eventRequestId: number, comment: string) {
        var url = `${this.url}/${this.endpoint}/deny`;

        return this.http.put(url, { id: eventRequestId, comment: comment })
            .toPromise()
            .then(() => { })
            .catch(this.handleError);
    }
}
