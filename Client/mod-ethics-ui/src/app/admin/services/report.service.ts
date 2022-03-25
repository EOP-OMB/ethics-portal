import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { EoyReport } from '../models/eoy-report.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private url: string;

    constructor(public http: HttpClient) {

        this.url = (environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl) + '/api/report';
    }

    public getEoyReport(year: number): Promise<EoyReport> {
        var url = `${this.url}/eoyreport/${year}`;

        return this.http.get<EoyReport>(url)
            .toPromise()
            .then(response => {
                var obj = this.formatResponse(response);
                return obj;
            })
            .catch(this.handleError);
    }

    formatResponse(data: EoyReport): EoyReport {
        return Object.assign(new EoyReport(), data);
    }

    handleError(error: Response | any): Promise<any> {
        console.log(error);
        return Promise.reject(error.message || error);
    }
}
