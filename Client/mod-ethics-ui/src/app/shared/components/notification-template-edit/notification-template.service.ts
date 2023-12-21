import { Injectable } from '@angular/core';
import { ModPromiseServiceBase } from 'mod-framework';
import { environment } from '@src/environments/environment';
import { NotificationTemplate } from './notification-template.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class NotificationTemplateService extends ModPromiseServiceBase<NotificationTemplate> {

    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'notificationtemplate', NotificationTemplate)
    }
}
