import { Component, OnInit, ViewChild } from '@angular/core';
import { Widget } from '@shared/models/widget.model';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { EmployeeService } from '@shared/services/employee.service';
import { EmployeeListService } from '@shared/services/employee-list.service';
import { EmployeeTableComponent } from '@admin/components/employee-table/employee-table.component';
import { Employee } from '@shared/models/employee.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EmployeeFilter } from '../../../shared/models/employee-filter.model';
import { CurrentUserService } from 'mod-framework';
import { Roles } from '../../../shared/static/roles.const';

@Component({
    selector: 'app-employee-view',
    templateUrl: './employee-view.component.html',
    styleUrls: ['./employee-view.component.scss']
})
export class EmployeeViewComponent implements OnInit {

    @ViewChild('dtEmployees') dtEmployees!: EmployeeTableComponent;

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer;

    selectedEmployee?: Employee;

    employees: Employee[] = [];

    numberOfBlankForms: number = 0;
    numberOfUnchangedForms: number = 0;

    filersWidget: Widget = new Widget();

    hiddenCols: string[] = [];

    constructor(private employeeService: EmployeeService, private employeeListService: EmployeeListService,
        private router: Router, private userService: CurrentUserService) {
    }

    canEditEmployees(): boolean {
        return this.userService.isInRole(Roles.Admin) || this.userService.isInRole(Roles.Support);
    }

    ngOnInit(): void {
        this.loadEmployees();
    }

    loadEmployees(includeInactive: boolean = false) {
        if (includeInactive) {
            this.employeeListService
                .getAllIncludeInactive()
                .then(employees => {
                    this.resolveEmployees(employees);
                });
        }
        else {
            this.employeeListService
                .getAll()
                .then(employees => {
                    this.resolveEmployees(employees);
                });
        }
        
    }

    resolveEmployees(employees: Employee[]) {
        this.employees = employees;

        if (this.employees) {
            var newEmps = this.employees.filter(x => (x.filerType == "Not Assigned" || !x.filerType) && x.inactive == false);
            var count = newEmps ? newEmps.length : 0;

            this.filersWidget.title = count.toString();
            this.filersWidget.text = "New Employees";
            this.filersWidget.actionText = "click to review";
            this.filersWidget.color = count >= 25 ? "danger" : count >= 10 ? "warning" : count > 0 ? "primary" : "success";
        }
    }

    onFilersClick() {
        var filter = new EmployeeFilter();

        filter.filerType = "Not Assigned";

        this.dtEmployees.resetFilters(filter);
    }

    onEmployeeSelect(employee: Employee): void {
        this.employeeService.get(employee.id).then(response => {
            this.showDrawer(response);
        });
    }

    showDrawer(employee: Employee): void {
        this.selectedEmployee = employee;

        this.drawer.open();
    }

    drawerClosing(): void {
        this.selectedEmployee = undefined;
    }

    onViewForm(employee: Employee): void {
        this.router.navigate(['/form', employee.currentFormId]);
    }

    gotoProfile(employee: Employee): void {
        this.router.navigate(['/profile', employee.id]);
    }

    onSave(employee: Employee): void {
        this.employeeService.save(employee).then(response => {
            this.loadEmployees();
            this.drawer.close();
        });
    }

    includeInactive(e: MatCheckboxChange) {
        this.loadEmployees(e.checked);
    }
}
