import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';

@Component({
    selector: 'app-employee-card',
    templateUrl: './employee-card.component.html',
    styleUrls: ['./employee-card.component.scss']
})
export class EmployeeCardComponent implements OnInit {

    @Input()
    employee: Employee = new Employee();

    @Input()
    showDetails: boolean = false;

    @Input()
    canEdit: boolean = false;

    @Input()
    showClose: boolean = false;

    @Output()
    close = new EventEmitter();

    @Output()
    select = new EventEmitter<Employee>();

    constructor() { }

    ngOnInit(): void {
        
    }

    employeeClick(employee: Employee) {
        this.select.emit(employee);
    }

    onClose() {
        this.close.emit();
    }

    get employeeType(): string {
        var type = this.employee.type;

        if (this.employee.subtype) {
            type += " - " + this.employee.subtype;
        }

        return type;
    }
}
