import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { Training } from '@shared/models/training.model';
import { TrainingChart } from '../models/training-chart.model';
import { TableData } from '../models/table-data.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService extends ModPromiseServiceBase<Training> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'training', Training)
    }

    getMyTrainings(): Promise<Training[]> {
        var url = `${this.url}/${this.endpoint}/mytraining`;

        return this.getAllByUrl(url);
    }

    getByUpn(upn: string): Promise<Training[]> {
        var url = `${this.url}/${this.endpoint}/getByUpn/${upn}`;

        return this.getAllByUrl(url);
    }

    getCurrentYear(): Promise<Training[]> {
        var url = `${this.url}/${this.endpoint}/currentyear`;

        return this.getAllByUrl(url);
    }

    getMissingTrainingReport(year: number): Observable<any> {
        var url = `${this.url}/${this.endpoint}/missingtrainingreport/${year}`;

        return this.getReport(url);
    }

    getMissingInitialTrainingReport(year: number, days: number): Observable<any> {
        var url = `${this.url}/${this.endpoint}/missinginitialtrainingreport?year=${year}&days=${days}`;

        return this.getReport(url);
    }

    getReport(url: string): Observable<any> {
        return this.http.request(new HttpRequest(
            'GET',
            url,
            null,
            {
                reportProgress: true,
                responseType: 'blob',
                withCredentials: true
            }));
    }

    getChart(year: number): Promise<TrainingChart> {
        var url = `${this.url}/${this.endpoint}/getChart/${year}`;

        return this.http
            .get<TrainingChart>(url)
            .toPromise()
            .catch(this.handleError);
    }

    // TODO:  Add this helper function to ModPromiseServiceBase
    private getAllByUrl(url: string) {
        return this.http
            .get<Training[]>(url)
            .toPromise()
            .then((response: Training[]) => {
                var data: Training[] = [];

                response.forEach(x => {
                    var obj = this.formatResponse(x);
                    data.push(obj);
                });

                return data;
            })
            .catch(this.handleError);
    }

    getTable(page: number, pageSize: number, sort: string, sortDirection: string, filter: string): Observable<TableData<Training>> {
        const url = `${this.url}/${this.endpoint}/getTable?page=${page}&pageSize=${pageSize}&sort=${sort}&sortDirection=${sortDirection}&filter=${filter}`;

        return this.http.get<TableData<Training>>(url).pipe(map((response: TableData<Training>) => {
            var data: Training[] = [];

            response.data.forEach(x => {
                var obj = this.formatResponse(x);
                data.push(obj);
            });

            response.data = data;

            return response;
        }));
    }

    formatResponse(data: Training): Training {
        data = super.formatResponse(data);

        data.trainingDate = data.trainingDate ? new Date(data.trainingDate) : null;

        return data;
    }
}
