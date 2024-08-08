import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { Employee } from '@shared/models/employee.model';
import { SelectItem } from '@shared/models/select-item.interface';
import { Helper } from '@shared/static/helper.funcs';
import { Lookups } from '@shared/static/lookups.static';
import { ReportingStatus } from '@shared/static/reporting-status.const';
import { FilerTypes } from '@shared/static/filer-types.const';
import { MatSelectChange } from '@angular/material/select';
import { FormStatus } from '../../static/form-status.const';

@Component({
    selector: 'app-employee-edit',
    templateUrl: './employee-edit.component.html',
    styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    employee: Employee = new Employee();

    @Input()
    canSave: boolean = false;

    @Output()
    viewForm = new EventEmitter<Employee>();

    @Output()
    save = new EventEmitter<Employee>();

    @Output()
    gotoProfile = new EventEmitter<Employee>();

    public editEmployee: Employee = new Employee();

    public employeeStatuses: SelectItem[];
    employeeTypes: SelectItem[];
    employeeSubtypes: SelectItem[];
    public reportingStatuses: SelectItem[];
    public filingTypes: SelectItem[];

    public tempAppointmentDate: Date | null = new Date();
    public tempDueDate: Date | null = null;

    activeText: string = "";
    activeIcon: string = "";
    activeColor: string = "";
    activeAction: string = "";

    isNewEntrant: boolean = true;

    emailText: string = "";
    tmpNewForm: boolean = false;

    constructor() {
        this.filingTypes = Lookups.FILER_TYPES;
        this.employeeStatuses = Lookups.DETAILEE_TYPE;
        this.reportingStatuses = Lookups.REPORTING_STATUSES;
        this.employeeTypes = Lookups.EMPLOYEE_TYPES;
        this.employeeSubtypes = []; //Lookups.EMPLOYEE_SUBTYPES;
    }

    ngOnInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.employee && changes.employee.currentValue) {
            this.initializeEmployee();
        }
    }

    ngOnDestroy(): void {
        
    }

    canCreateNewForm(): boolean {
        return (this.editEmployee.currentFormId == 0 ||
            this.editEmployee.currentFormStatus == FormStatus.CANCELED ||
            this.editEmployee.currentFormStatus == FormStatus.CERTIFIED ||
            this.editEmployee.currentFormStatus == FormStatus.DECLINED ||
            this.editEmployee.currentFormStatus.toLowerCase().includes(FormStatus.EXPIRED.toLowerCase())) && this.canSave;
    }

    private initializeEmployee() {
        this.editEmployee = new Employee();

        if (this.employee.type)
            this.loadSubtypes(this.employee.type);

        this.editEmployee.copy(this.employee);

        this.updateNewEntrant();

        this.tempAppointmentDate = Helper.getDate(this.editEmployee.appointmentDate);

        
        this.setActiveStatus(this.editEmployee);
    }

    private updateNewEntrant() {
        this.isNewEntrant = this.editEmployee.reportingStatus == ReportingStatus.NEW_ENTRANT;
        this.emailText = this.isNewEntrant ? this.editEmployee.newEntrantEmailText : this.editEmployee.annualEmailText;
    }

    private setActiveStatus(emp: Employee) {
        if (emp.inactive) {
            this.activeText = "inactive";
            this.activeColor = "danger";
            this.activeIcon = "remove-circle";
            this.activeAction = "click to activate";
        }
        else {
            this.activeText = "active";
            this.activeColor = "success";
            this.activeIcon = "ok-circle";
            this.activeAction = "click to deactivate";
        }
    }

    startNewFormChange(): void {
        this.updateDueDate();
    }

    reportingStatusChange() {
        this.updateDueDate();

        this.updateNewEntrant();
    }

    private updateDueDate() {
        var startDate = this.employee.reportingStatus == ReportingStatus.NEW_ENTRANT ? Helper.getDate(this.employee.appointmentDate, true) : new Date();
        var newDate = Helper.addDays(startDate ?? new Date(), 30);

        this.employee.dueDate = Helper.formatDate(newDate) ?? "";
        this.tempDueDate = Helper.getDate(this.employee.dueDate);
    }

    public error: boolean = false;

    public saveEmployee(employee: Employee) {
        if (this.editEmployee.generateForm && !this.tempDueDate) {
            this.error = true;
            return;
        }
        else {
            this.error = false;
        }

        employee.dueDate = Helper.formatDate(this.tempDueDate) ?? '';
        employee.appointmentDate = Helper.formatDate(this.tempAppointmentDate) ?? '';

        if (employee.filerType == FilerTypes.FORM_450_FILER) {
            if (employee.reportingStatus == ReportingStatus.ANNUAL)
                employee.annualEmailText = this.emailText;
            else
                employee.newEntrantEmailText = this.emailText;
        }

        this.save.emit(employee);
    }

    public gotoForm(employee: Employee) {
        this.viewForm.emit(employee);
    }

    public profileClick(employee: Employee) {
        this.gotoProfile.emit(employee);
    }

    public typeChange(opt: MatSelectChange) {
        var value = opt.value;

        this.loadSubtypes(value);

        this.editEmployee.subtype = "";
    }

    loadSubtypes(value: string) {
        this.employeeSubtypes = Lookups.EMPLOYEE_SUBTYPES.filter(x => x.group == value);
    }
}
