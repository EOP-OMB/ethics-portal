import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { OgeForm450 } from '@shared/models/oge-form-450.model';

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

    public getFormsByEmployee(employeeId: number): Promise<OgeForm450[]> {
        var url = `${this.url}/${this.endpoint}/getFormsByEmployee/${employeeId}`;

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
}
