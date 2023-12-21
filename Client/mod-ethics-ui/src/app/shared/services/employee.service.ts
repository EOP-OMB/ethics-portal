import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { map, of, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService extends ModPromiseServiceBase<Employee> {
    public isSearching: boolean = false;

    search(term: Observable<string>) {
        return term.pipe(debounceTime(200),
            distinctUntilChanged(), 
            switchMap((term: string) => this.searchEmployees(encodeURIComponent(term))));
    }

    getByUpn(upn: string): Promise<Employee> {
        var url = `${this.url}/${this.endpoint}/getbyupn/${upn}`;

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

    searchEmployees(term: string): Observable<Employee[]> {
        var url = `${this.url}/${this.endpoint}/search/${term}`;

        if (term.length > 2) {
            this.isSearching = true;
            return this.http.get<Employee[]>(url).pipe(map((res: Employee[]) => {
                var data: Employee[] = [];

                res.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                this.isSearching = false;
                return data;
            }));
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

    formatResponse(data: Employee): Employee {
        data = super.formatResponse(data);

        data.hireDate = data.hireDate ? new Date(data.hireDate) : null;
        data.annualSalary = Number(data.annualSalary) == 0 ? null : Number(data.annualSalary);

        return data;
    }
}
