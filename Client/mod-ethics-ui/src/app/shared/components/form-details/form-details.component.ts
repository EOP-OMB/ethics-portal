import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { SelectItem } from '@shared/models/select-item.interface';
import { Helper } from '@shared/static/helper.funcs';
import { FormStatus } from '../../static/form-status.const';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';

export const AccessLevels =
{
    ReadOnly: "ReadOnly",
    Assign: "Assign",
    Edit: "Edit"
};


@Component({
    selector: 'app-form-details',
    templateUrl: './form-details.component.html',
    styleUrls: ['./form-details.component.scss']
})
export class FormDetailsComponent implements OnInit {

    @Input()
    form: OgeForm450 = new OgeForm450();

    @Input()
    accessLevel: string = AccessLevels.ReadOnly;

    @Input()
    canExtend: boolean = false;

    @Input()
    reviewers: SelectItem[] = [];

    @Output()
    save = new EventEmitter<OgeForm450>();

    @Output()
    view = new EventEmitter<OgeForm450>();

    @Output()
    cancel = new EventEmitter<OgeForm450>();

    @Output()
    extend = new EventEmitter<OgeForm450>();

    constructor(private employeeService: EmployeeService, private router: Router) { }

    ngOnInit(): void {
        
    }

    get canEdit(): boolean {
        return this.accessLevel == AccessLevels.Edit;
    }

    get canAssign(): boolean {
        return this.accessLevel == AccessLevels.Edit || this.accessLevel == AccessLevels.Assign;
    }

    saveClick(): void {
        var upn = this.form.assignedToUpn;
        this.form.assignedTo = upn && upn != 'na' ? this.reviewers.filter(x => x.value == upn)[0].text : '';
        this.save.emit(this.form);
    }

    viewForm(form: OgeForm450) {
        this.view.emit(form);
    }

    cancelClick(): void {
        if (this.canEdit)
            this.cancel.emit(this.form);
    }

    extendForm(form: OgeForm450) {
        this.extend.emit(form);
    }

    isCertified(form: OgeForm450) {
        return form.formStatus == FormStatus.CERTIFIED;
    }

    isCanceled(form: OgeForm450) {
        return form.formStatus.includes(FormStatus.CANCELED);
    }

    employeeClick(upn: string) {
        this.employeeService.getByUpn(upn).then(response => {
            if (response && response.id > 0)
                this.router.navigate(['/profile', response.id]);
        });
    }
}
