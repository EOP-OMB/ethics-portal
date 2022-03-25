import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { finalize } from 'rxjs/operators';
import { KeyCodes } from '../../static/key-codes.const';


@Component({
    selector: 'app-people-picker',
    templateUrl: './people-picker.component.html',
    styleUrls: ['./people-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PeoplePickerComponent),
            multi: true
        }
    ]
})
export class PeoplePickerComponent implements ControlValueAccessor, OnInit, Validator {
    @Output()
    onPeoplePicked = new EventEmitter<Employee>();

    items: Employee[] = [];
    resultedItems: Employee[] | null = null;

    selectedEmp: Employee | null = null;

    touched: boolean = false;
    disabled: boolean = false;

    public get searching(): boolean {
        return this.employeeService.isSearching;
    }

    lock: boolean = false;
    public get pickerTooltip(): string {
        return this.selectedEmp ? this.selectedEmp.emailAddress + ' - ' + this.selectedEmp.displayName : "";
    };

    term$ = new Subject<string>();

    termControl = new FormControl(null, Validators.required);

    searchTerm: string = "";

    constructor(private employeeService: EmployeeService) {
        employeeService.search(this.term$)
            .subscribe((employees: Employee[]) => {
                this.items = employees;
                this.resultedItems = employees;
            });

    }

    selectionChange(item: Employee, event: any) {
        this.lock = true;
        setTimeout(() => {
            this.setEmployee(item);
        }, 100);
    }

    ngOnInit(): void {
       
    }

    onTouch(e: any) {
        this.markAsTouched();
    }

    markAsTouched(): void {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }

    setDisabledState(disabled: boolean) {
        this.disabled = disabled;
    }
        
    search(term: string, event: KeyboardEvent | null) {
        let safeKeys: string[] = [KeyCodes.TAB, KeyCodes.ENTER, KeyCodes.HOME, KeyCodes.END, KeyCodes.UP_ARROW, KeyCodes.DOWN_ARROW, KeyCodes.RIGHT_ARROW, KeyCodes.LEFT_ARROW, KeyCodes.CTRL_LEFT, KeyCodes.CTRL_RIGHT];

        if (!this.lock && (!this.selectedEmp || term != this.selectedEmp?.displayName) && safeKeys.filter(x => x == event?.code).length == 0 && !event?.ctrlKey) {
            this.highlightIndex = undefined;
            this.selectedEmp = null;
            this.resultedItems = null;
            this.searchTerm = term;
            this.term$.next(term);
        } else {
            this.searchTerm = term;
        }
    }

    highlightIndex?: number;

    keyDown(event: KeyboardEvent | null) {
        if (event?.code == KeyCodes.DOWN_ARROW) {
            if (this.highlightIndex == undefined || this.highlightIndex >= this.items.length-1)
                this.highlightIndex = 0;
            else
                this.highlightIndex++;
        }
        else if (event?.code == KeyCodes.UP_ARROW) {
            if (this.highlightIndex != undefined && this.highlightIndex > 0)
                this.highlightIndex--;
            else
                this.highlightIndex = this.items.length - 1;
        }
    }

    private setEmployee(emp: Employee) {
        this.items = [];
        this.resultedItems = null;
        this.selectedEmp = emp;
        this.lock = false;
        this.highlightIndex = undefined;
        this.term$.next("");
        this.termControl.setValue(emp?.displayName);
        this.onPeoplePicked.emit(emp);

        this.onChange(emp);
        this.onTouched();
    }

    // Control Value Accessor Implementation
    onChange: any = () => { };
    onTouched: any = () => { };

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    writeValue(value: Employee) {
        this.setEmployee(value);
    }

    error: boolean = false;

    @Input()
    required: boolean | string | null = null;

    validate(control: AbstractControl): ValidationErrors | null {
        const employee = control.value;
        if (employee == null) {
            this.error = true;
            return {
                required: 'You must select an employee'
            };
        }

        return null;
    }

    autocompleteClosed(e: any) {
        if (!this.lock) {
            if (this.items.length > 0 && this.resultedItems != null) {
                this.lock = true;

                var emp: Employee;

                if (this.highlightIndex)
                    emp = this.items[this.highlightIndex];
                else
                    emp = this.items[0];

                this.setEmployee(emp);
            }
        }
    }
}
