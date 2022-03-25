import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlBaseComponent } from '../control-base/control-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-check-box',
    templateUrl: './check-box.component.html',
    styleUrls: ['./check-box.component.scss', '../control-base/control-base.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckBoxComponent),
            multi: true
        }
    ]
})
export class CheckBoxComponent extends ControlBaseComponent implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {

    }
}
