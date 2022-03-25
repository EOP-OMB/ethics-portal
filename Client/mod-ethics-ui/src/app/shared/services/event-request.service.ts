import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { EventRequest } from '@shared/models/event-request.model';

@Injectable({
    providedIn: 'root'
})
export class EventRequestService extends ModPromiseServiceBase<EventRequest> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'eventrequest', EventRequest)
    }

    getMyEvents(): Promise<EventRequest[]> {
        var url = `${this.url}/${this.endpoint}/myevents`;

        return this.getAllByUrl(url);
    }

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

    resendAssignedToEmail(id: number): Promise<any> {
        var url = `${this.url}/${this.endpoint}/resendemail/${id}`;

        return this.http.get(url)
            .toPromise()
            .then()
            .catch(this.handleError);
    }

}
