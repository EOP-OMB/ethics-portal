import { Component, OnInit, Input } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { Settings } from '@shared/models/settings.model';

@Component({
    selector: 'app-form-compare',
    templateUrl: './form-compare.component.html',
    styleUrls: ['./form-compare.component.scss']
})
export class FormCompareComponent implements OnInit {

    @Input()
    form: OgeForm450 | null = null;

    @Input()
    prevForm: OgeForm450 | null = null;

    @Input()
    settings: Settings | null = null;

    constructor() { }

    ngOnInit() {
    }
}
