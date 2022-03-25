import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlBaseComponent } from '../control-base/control-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-text-area',
    templateUrl: './text-area.component.html',
    styleUrls: ['./text-area.component.scss', '../control-base/control-base.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextAreaComponent),
            multi: true
        }
    ]
})
export class TextAreaComponent extends ControlBaseComponent implements OnInit {

    @Input()
    rows: number = 0;

    @Input()
    showLabel: boolean = false;

    @Input()
    customStyle: string = "";

    constructor() {
        super();
    }

    ngOnInit() {
    }

}
