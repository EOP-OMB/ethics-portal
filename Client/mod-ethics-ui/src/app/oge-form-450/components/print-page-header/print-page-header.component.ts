import { Component, Input, OnInit } from '@angular/core';
import { Settings } from '@shared/models/settings.model';

@Component({
    selector: 'app-print-page-header',
    templateUrl: './print-page-header.component.html',
    styleUrls: ['../form/form.component.scss']
})
export class PrintPageHeaderComponent implements OnInit {

    @Input()
    employeesName: string = "";

    @Input()
    settings: Settings = new Settings();

    constructor() {
    }

    ngOnInit(): void {
    }

}
