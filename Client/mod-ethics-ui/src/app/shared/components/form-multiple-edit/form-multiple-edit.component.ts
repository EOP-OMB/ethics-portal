import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from '@shared/models/employee.model';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { SelectItem } from '@shared/models/select-item.interface';


@Component({
    selector: 'app-form-multiple-edit',
    templateUrl: './form-multiple-edit.component.html',
    styleUrls: ['./form-multiple-edit.component.scss']
})
export class FormMultipleEditComponent implements OnInit {
    @Input()
    forms: OgeForm450[] = [];

    @Input()
    reviewers: SelectItem[] = []

    @Output()
    save = new EventEmitter<number>();

    assignedToEmployeeId: number = 0;

    constructor() { }

    ngOnInit(): void {
    }

    saveClick(): void {
        this.save.emit(this.assignedToEmployeeId);
    }
}
