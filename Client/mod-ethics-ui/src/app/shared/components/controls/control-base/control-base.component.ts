import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

declare var $: any;

@Component({
    selector: 'app-control-base',
    templateUrl: './control-base.component.html',
    styleUrls: ['./control-base.component.scss']
})
export class ControlBaseComponent implements OnInit, ControlValueAccessor {
    @Input()
    name: string = "";

    @Input()
    prevValue: any;

    @Input()
    required: boolean = true;

    private _value: any;

    public onTouched: any = () => { };
    public onChanged: any = (_: any) => { };

    public disabled: boolean = false;

    public displayCssClass: string = "value-same";
    public indicator: string = "";

    constructor() { }
    ngOnInit() {
    }

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChanged(v);
            this.valueChanged();
        }
    }

    writeValue(obj: any): void {
        if (obj !== undefined && obj != null && obj !== this.value) {
            this._value = obj;
            this.valueChanged();
        }
    }

    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onBlur(): void {
        this.onTouched();
    }

    valueChanged() {
        if (this.prevValue !== undefined && this.prevValue != null) {
            if (this.value === this.prevValue) {
                this.changeBackgroundColor('value-same');
                this.indicator = '';
            }
            else {
                if (this.value && !this.prevValue) {
                    this.changeBackgroundColor('value-new');
                    this.indicator = 'indicator-new';
                }
                else if (!this.value) {
                    this.changeBackgroundColor('value-deleted');
                    this.indicator = 'indicator-deleted';
                }
                else {
                    this.changeBackgroundColor('value-updated');
                    this.indicator = 'indicator-updated';
                }
            }
        }
        else {
            this.changeBackgroundColor('value-same');
        }
    }

    changeBackgroundColor(colorCssClass: string) {
        this.displayCssClass = colorCssClass;
    }
}
