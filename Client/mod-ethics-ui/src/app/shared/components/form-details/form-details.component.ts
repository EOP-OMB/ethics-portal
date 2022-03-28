import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { SelectItem } from '@shared/models/select-item.interface';
import { Helper } from '@shared/static/helper.funcs';
import { FormStatus } from '../../static/form-status.const';

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

    tempDueDate: Date | null = null;

    constructor() { }

    ngOnInit(): void {
        this.tempDueDate = Helper.getDate(this.form.dueDate);
    }

    get canEdit(): boolean {
        return this.accessLevel == AccessLevels.Edit;
    }

    get canAssign(): boolean {
        return this.accessLevel == AccessLevels.Edit || this.accessLevel == AccessLevels.Assign;
    }

    saveClick(): void {
        if (this.canEdit) {
            var dateString = Helper.formatDate(this.tempDueDate);
            this.form.dueDate = dateString ?? "";
        }
        
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
}
