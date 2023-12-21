import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { map, Observable } from 'rxjs';
import { TableData } from '../models/table-data.model';
import { OgeForm450Summary } from '../models/oge-form-450-summary.model';
import { OgeForm450StatusChart } from '../models/oge-form-450-status-chart.model';

@Injectable({
  providedIn: 'root'
})
export class OGEForm450Service extends ModPromiseServiceBase<OgeForm450> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'ogeform450', OgeForm450)
    }

    getMyForms(): Promise<OgeForm450[]> {
        var url = `${this.url}/${this.endpoint}/myforms`;

        return this.getAllByUrl(url);
    }

    getReviewableForms(): Promise<OgeForm450[]> {
        var url = `${this.url}/${this.endpoint}/reviewer`;
            
        return this.getAllByUrl(url);
    }

    certifyForms(action: string): Promise<OgeForm450[]> {
        var url = `${this.url}/${this.endpoint}/certify?a=` + action;

        return this.getAllByUrl(url);
    }

    getAllByYear(year: string): Promise<OgeForm450[]> {
        var url = `${this.url}/${this.endpoint}/getByYear?year=` + year;

        return this.getAllByUrl(url);
    }

    public getFormsByEmployee(upn: string): Promise<OgeForm450[]> {
        var url = `${this.url}/${this.endpoint}/getFormsByEmployee/${upn}`;

        return this.getAllByUrl(url);
    }

    private getAllByUrl(url: string): Promise<OgeForm450[]> {
        return this.http
            .get<OgeForm450[]>(url)
            .toPromise()
            .then((response: OgeForm450[]) => {
                var data: OgeForm450[] = [];

                response.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                return data;
            })
            .catch(this.handleError);
    }

    private getByUrl(url: string): Promise<OgeForm450> {
        return this.http
            .get<OgeForm450>(url)
            .toPromise()
            .then((response: OgeForm450) => {
                var data: OgeForm450 = this.formatResponse(response);

                return data;
            })
            .catch(this.handleError);
    }

    getPrevious(id: number): Promise<OgeForm450> {
        var url = `${this.url}/${this.endpoint}/previous/${id}`;

        return this.getByUrl(url);
    }

    getCurrentForm(): Promise<OgeForm450> {
        var url = `${this.url}/${this.endpoint}/mycurrent`;

        return this.getByUrl(url);
    }

    getTable(page: number, pageSize: number, sort: string, sortDirection: string, filter: string): Observable<TableData<OgeForm450>> {
        const url = `${this.url}/${this.endpoint}/getTable?page=${page}&pageSize=${pageSize}&sort=${sort}&sortDirection=${sortDirection}&filter=${filter}`;

        return this.http.get<TableData<OgeForm450>>(url).pipe(map((response: TableData<OgeForm450>) => {
            var data: OgeForm450[] = [];
            
            response.data.forEach(x => {
                var obj = this.formatResponse(x);
                data.push(obj);
            });

            response.data = data;

            return response;
        }));
    }

    getSummary(): Promise<OgeForm450Summary> {
        var url = `${this.url}/${this.endpoint}/getSummary`;

        return this.http
            .get<OgeForm450Summary>(url)
            .toPromise()
            .catch(this.handleError);
    }

    getStatusChart(): Promise<OgeForm450StatusChart> {
        var url = `${this.url}/${this.endpoint}/getStatusChart`;

        return this.http
            .get<OgeForm450StatusChart>(url)
            .toPromise()
            .catch(this.handleError);
    }

    assignForm(id: number, assignedToUpn: string): Promise<OgeForm450> {
        const url = `${this.url}/${this.endpoint}/assignForm/${id}`;

        var body = { assignedToUpn: assignedToUpn };

        return this.http.put<OgeForm450>(url, body).toPromise()
            .then(response => {
                var obj = this.formatResponse(response);
                return obj;
            });
    }

    formatResponse(form: OgeForm450): OgeForm450 {
        if (form) {
            form = super.formatResponse(form);
            form.dueDate = form.dueDate ? new Date(form.dueDate) : null;
            form.dateOfSubstantiveReview = form.dateOfSubstantiveReview ? new Date(form.dateOfSubstantiveReview) : null;
        }

        return form;
    }
}
