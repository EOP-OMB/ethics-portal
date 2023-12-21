import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { Employee } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeListService extends ModPromiseServiceBase<Employee> {
    private _reviewers?: Promise<Employee[]>;

    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'employeeList', Employee)
    }

    getAllIncludeInactive(): Promise<Employee[]> {
        var url = `${this.url}/${this.endpoint}/includeInactive`;

        return this.getAllByUrl(url);
    }

    getReviewers(): Promise<Employee[]> {
        var url = `${this.url}/${this.endpoint}/reviewers`;

        if (!this._reviewers) {
            return this.getAllByUrl(url);
        }
        else {
            return this._reviewers;
        }
    }

    getEventReviewers(): Promise<Employee[]> {
        var url = `${this.url}/${this.endpoint}/eventreviewers`;

        if (!this._reviewers) {
            return this.getAllByUrl(url);
        }
        else {
            return this._reviewers;
        }
    }

    private getAllByUrl(url: string): Promise<Employee[]> {
        return this.http
            .get<Employee[]>(url)
            .toPromise()
            .then((response: Employee[]) => {
                var data: Employee[] = [];

                response.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                return data;
            })
            .catch(this.handleError);
    }
}
