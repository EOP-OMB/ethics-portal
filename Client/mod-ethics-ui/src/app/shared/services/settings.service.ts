import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { Settings } from '@shared/models/settings.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsService extends ModPromiseServiceBase<Settings> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'settings', Settings)
    }

    public get(): Promise<Settings> {
        return super.getAll().then(response => response[0]);
    }

    initiateAnnualRollover(): Promise<Settings> {
        var url = `${this.url}/${this.endpoint}/initiateAnnualRollover`;

        return this.getByUrl(url);
    }

    private getByUrl(url: string): Promise<Settings> {
        return this.http
            .get<Settings>(url)
            .toPromise()
            .then((response: Settings) => {
                var data: Settings = this.formatResponse(response);

                return data;
            })
            .catch(this.handleError);
    }
}
