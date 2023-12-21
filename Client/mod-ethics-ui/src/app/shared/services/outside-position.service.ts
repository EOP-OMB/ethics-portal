import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { OutsidePosition } from '../models/outside-position.model';
import { TableData } from '../models/table-data.model';
import { Observable, map } from 'rxjs';
import { OutsidePositionSummary } from '../models/outside-position-summary.model';
import { Employee } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class OutsidePositionService extends ModPromiseServiceBase<OutsidePosition> {
       
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'outsideposition', OutsidePosition)
    }

    public getByEmployee(upn: string): Promise<OutsidePosition[]> {
        var url = `${this.url}/${this.endpoint}/getByEmployee/${upn}`;

        return this.getAllByUrl(url);
    }

    public submit(position: OutsidePosition): Promise<OutsidePosition> {
        var url = `${this.url}/${this.endpoint}/submit/${position.id}`;

        return this.http.put<OutsidePosition>(url, position)
            .toPromise()
            .then(response => {
                var obj = this.formatResponse(response);
                return obj;
            })
            .catch(this.handleError);
    }

    public approve(position: OutsidePosition): Promise<OutsidePosition> {
        var url = `${this.url}/${this.endpoint}/approve/${position.id}`;

        return this.http.put<OutsidePosition>(url, position)
            .toPromise()
            .then(response => {
                var obj = this.formatResponse(response);
                return obj;
            })
            .catch(this.handleError);
    }

    public disapprove(position: OutsidePosition): Promise<OutsidePosition> {
        var url = `${this.url}/${this.endpoint}/disapprove/${position.id}`;

        return this.http.put<OutsidePosition>(url, position)
            .toPromise()
            .then(response => {
                var obj = this.formatResponse(response);
                return obj;
            })
            .catch(this.handleError);
    }

    public cancelRequest(position: OutsidePosition): Promise<OutsidePosition> {
        var url = `${this.url}/${this.endpoint}/cancelRequest/${position.id}`;

        return this.http.put<OutsidePosition>(url, position)
            .toPromise()
            .then(response => {
                var obj = this.formatResponse(response);
                return obj;
            })
            .catch(this.handleError);
    }

    private getAllByUrl(url: string): Promise<OutsidePosition[]> {
        return this.http
            .get<OutsidePosition[]>(url)
            .toPromise()
            .then((response: OutsidePosition[]) => {
                var data: OutsidePosition[] = [];

                response.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                return data;
            })
            .catch(this.handleError);
    }

    formatResponse(data: OutsidePosition): OutsidePosition {
        data = super.formatResponse(data);

        data.annualSalary = Number(data.annualSalary) == 0 ? null : Number(data.annualSalary);
        data.startDate = data.startDate ? new Date(data.startDate) : null;
        data.endDate = data.endDate ? new Date(data.endDate) : null;
        data.submittedDate = data.submittedDate ? new Date(data.submittedDate) : null;

        data.outsidePositionStatuses.forEach(st => st.createdTime = st.createdTime ? new Date(st.createdTime) : null);

        return data;
    }

    getTable(page: number, pageSize: number, sort: string, sortDirection: string, filter: string): Observable<TableData<OutsidePosition>> {
        const url = `${this.url}/${this.endpoint}/getTable?page=${page}&pageSize=${pageSize}&sort=${sort}&sortDirection=${sortDirection}&filter=${filter}`;

        return this.http.get<TableData<OutsidePosition>>(url).pipe(map((response: TableData<OutsidePosition>) => {
            var data: OutsidePosition[] = [];

            response.data.forEach(x => {
                var obj = this.formatResponse(x);
                data.push(obj);
            });

            response.data = data;

            return response;
        }));
    }

    getSummary(): Promise<OutsidePositionSummary> {
        var url = `${this.url}/${this.endpoint}/getSummary`;

        return this.http
            .get<OutsidePositionSummary>(url)
            .toPromise()
            .catch(this.handleError);
    }
}
