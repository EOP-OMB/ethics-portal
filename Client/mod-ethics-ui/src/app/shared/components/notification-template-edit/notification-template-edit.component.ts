import { Component, Input, OnInit } from '@angular/core';
import { NotificationTemplate } from './notification-template.model';
import { SelectItem } from '../../models/select-item.interface';
import { NotificationTemplateService } from './notification-template.service';
import { Lookups } from '../../static/lookups.static';

@Component({
    selector: 'app-notification-template-edit',
    templateUrl: './notification-template-edit.component.html',
    styleUrls: ['./notification-template-edit.component.scss']
})
export class NotificationTemplateEditComponent implements OnInit {

    templates: NotificationTemplate[];

    private selectedTemplate: NotificationTemplate;
    private origTemplate: NotificationTemplate;

    //private settings: Settings;

    recipientTypes: SelectItem[];

    constructor(private templateService: NotificationTemplateService,
        /*private settingsService: SettingsService*/) { }

    ngOnInit(): void {
        this.getSettings();

        this.recipientTypes = Lookups.RECIPIENT_TYPES;
        this.templateService.getAll().then(response => this.templates = response);
    }

    getSettings(): void {
        //this.settingsService.get().then(response => {
        //    this.settings = response;
        //});
    }

    public isDirty(): boolean {
        return JSON.stringify(this.origTemplate) != JSON.stringify(this.selectedTemplate);
    }

    templateSelected(template: NotificationTemplate) {
        // deactivate all templates
        this.templates.forEach(template => template.active = false);

        // activate the template the user has clicked on.
        template.active = true;

        this.templateService.get(template.id).then(response => {
            this.origTemplate = JSON.parse(JSON.stringify(response));
            this.selectedTemplate = response;
            //var editor = tinymce.get('txtBody');
            //if (editor)
            //    editor.setContent(this.selectedTemplate.body);
        });
    }

    saveTemplate() {
        this.templateService.update(this.selectedTemplate).then(response => {
            this.selectedTemplate = response;
            this.origTemplate = JSON.parse(JSON.stringify(response));

            $("#template-success").alert();

            $("#template-success").fadeTo(2000, 500).slideUp(500, function () {
                $("#template-success").slideUp(500);
            });
        });
    }

    keys(): Array<string> {
        return Object.keys(this.selectedTemplate.templateFields);
    }

    keyupHandlerFunction(content: string) {
        this.selectedTemplate.body = content;
    }
}
