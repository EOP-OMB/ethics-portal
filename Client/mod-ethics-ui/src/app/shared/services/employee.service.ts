import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { of } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { Employee } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService extends ModPromiseServiceBase<Employee> {
    public isSearching: boolean = false;

    search(term: Observable<string>) {
        return term.debounceTime(200)
            .distinctUntilChanged()
            .switchMap((term: string) => this.searchEmployees(term));
    }

    searchEmployees(term: string): Observable<Employee[]> {
        var url = `${this.url}/${this.endpoint}/search/${term}`;

        if (term.length > 2) {
            this.isSearching = true;
            return this.http.get<Employee[]>(url).map((res: Employee[]) => {
                var data: Employee[] = [];

                res.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                this.isSearching = false;
                return data;
            });
        }
        else {
            this.isSearching = false;
            return of<Employee[]>([]);
        }
        
    }
    
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'employee', Employee)
    }

    getMyProfile(): Promise<Employee> {
        var url = `${this.url}/${this.endpoint}/myprofile`;

        return this.http
            .get<Employee>(url)
            .toPromise()
            .then((response: Employee) => {
                var data: Employee;

                data = this.formatResponse(response);

                //this._myPortfolio = Object.assign(new Employee(), data);
                return data;
            })
            .catch(this.handleError);
    }   
}
