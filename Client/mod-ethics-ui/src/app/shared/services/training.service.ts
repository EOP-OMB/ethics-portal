import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { Training } from '@shared/models/training.model';

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

    getCurrentYear(): Promise<Training[]> {
        var url = `${this.url}/${this.endpoint}/currentyear`;

        return this.getAllByUrl(url);
    }

    // TODO:  Move to ReportService
    getMissingTrainingReport(year: number): Promise<any> {
        var url = `${this.url}/${this.endpoint}/missingtrainingreport/${year}`;

        return this.http
            .get(url)
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
}
