import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CurrentUserService } from 'mod-framework';
import { ExtensionRequest } from '../../../shared/models/extension-request.model';
import { Helper } from '../../../shared/static/helper.funcs';
import { Roles } from '../../../shared/static/roles.const';
import { ExtensionStatus } from '../../static/extension-status.const';

@Component({
    selector: 'app-extension-request',
    templateUrl: './extension-request.component.html',
    styleUrls: ['./extension-request.component.scss']
})
export class ExtensionRequestComponent implements OnInit, OnChanges {

    @Input()
    extension: ExtensionRequest = new ExtensionRequest();

    @Output()
    approve = new EventEmitter<ExtensionRequest>();

    @Output()
    reject = new EventEmitter<ExtensionRequest>();

    @Output()
    save = new EventEmitter<ExtensionRequest>();

    days: Array<number> = new Array<number>(0);
    message: string = "";

    showError: boolean = false;
    daysRemaining: number = 90;

    constructor(private userService: CurrentUserService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.extension && changes.extension.currentValue) {
            this.days = new Array<number>(0);

            this.daysRemaining = 90 - this.extension.form.daysExtended;
            var maxDays = this.daysRemaining > 45 ? 45 : this.daysRemaining;

            for (var i = 1; i <= maxDays; i++)
                this.days.push(i);

            this.initializeMessage();
        }
    }

    ngOnInit(): void {
        if (this.extension && this.extension.id > 0)
            this.newDueDate = Helper.formatDate(this.extension.extensionDate);
    }

    initializeMessage() {
        if (this.extension.id == 0) {
            if (this.daysRemaining <= 0) {
                this.message = "You have used up all your extension days.";
            }
            else {
                this.message = 'Your <b>' + this.extension.form.year + '</b> ' + this.extension.form.reportingStatus + ' filing is <b>' + this.extension.form.formStatus + '</b>.  If you require more time to finish, please choose number of days and provide a reason and your request will be reviewed.  Individual extension requests of up to 45 days will be considered <b>for good cause shown</b>.  Multiple extensions can be requested up to a maximum of 90 days.';
            }
            
        }
        else if (this.extension.status == ExtensionStatus.PENDING) {
            if (this.canReview()) {
                this.message = "Please review this request and use the buttons below to accept or reject the request.  Leave a comment to be included in the resulting email to the filer.";
            }
            else
                this.message = 'Your request for a ' + this.extension.daysRequested + ' day extension has been submitted and is awaiting approval.  If approved, your due date will be updated accordingly.  You will receive an email with the reviewer\'s decision when it is made.';
        }
    }

    public canReview(): boolean {
        return (this.userService.isInRole(Roles.Reviewer) || this.userService.isInRole(Roles.Admin) || this.userService.isInRole(Roles.Support)) && this.extension.status == ExtensionStatus.PENDING;
    }

    workflowClick(approve: boolean): void {
        if (approve) {
            this.approve.emit(this.extension);
        }
        else {
            this.reject.emit(this.extension);
        }
    }

    saveClick(): void {
        if (this.extension.daysRequested > 0 && this.extension.reason && this.newDueDate) {
            this.extension.dueDate = new Date(this.extension.form.dueDate);
            this.extension.extensionDate = new Date(this.newDueDate.toString());
            this.extension.filerName = this.extension.form.employeesName;
            this.extension.year = this.extension.form.year;
            this.extension.ogeForm450Id = this.extension.form.id;
            this.save.emit(this.extension);
        } else {
            this.showError = true;
        }
    }

    public newDueDate: string | null = null;

    reasonChange(): void {
        this.showError = false;
    }

    daysChange(): void {
        this.showError = false;
        var newDate = Helper.addDays(new Date(this.extension.form.dueDate), this.extension.daysRequested);
        this.newDueDate = Helper.formatDate(newDate);
    }

    canEdit(): boolean {
        return this.extension.id == 0 || (this.extension.status == ExtensionStatus.PENDING && this.extension.form.filer == this.userService.user.upn);
    }
}
