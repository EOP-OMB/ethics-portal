import { Component, OnInit, ViewChild } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { ReviewerDashboard } from '@oge450/models/reviewer-dashboard.model';
import { Widget } from '@shared/models/widget.model';
import { SelectItem } from '@shared/models/select-item.interface';

import { ExtensionRequest } from '@shared/models/extension-request.model';
import { OGEForm450Service } from '@shared/services/oge-form-450.service';
import { Router } from '@angular/router';
import { ExtensionRequestService } from '@shared/services/extension-request.service';
import { FormStatus } from '@shared/static/form-status.const';
import { MatDrawer } from '@angular/material/sidenav';
import { FormTableComponent } from '@shared/components/form-table/form-table.component';
import { EmployeeListService } from '@shared/services/employee-list.service';
import { ExtensionStatus } from '@shared/static/extension-status.const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserService } from 'mod-framework';
import { Roles } from '@shared/static/roles.const';
import { AccessLevels } from '@shared/components/form-details/form-details.component';
import { SettingsService } from '@shared/services/settings.service';
import { Settings } from '@shared/models/settings.model';

@Component({
    selector: 'app-form-view-base',
    templateUrl: './form-view-base.component.html',
    styleUrls: ['./form-view-base.component.scss']
})
export abstract class FormViewBaseComponent {

    @ViewChild('dtForms') dtForms!: FormTableComponent;

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer;

    selectedForm?: OgeForm450;
    selectedExtension?: ExtensionRequest;
    selectedForms?: OgeForm450[];

    forms: OgeForm450[] = [];
    extensions: ExtensionRequest[] = [];

    submittedWidget: Widget = new Widget();
    extensionWidget: Widget = new Widget();
    overdueWidget: Widget = new Widget();

    reviewers: SelectItem[] = [];

    selectedIndex: number = 0; // 0 - Forms tab, 1 - Extensions tab

    hiddenCols: string[] = [];

    years: SelectItem[] = [];
    settings: Settings = new Settings();

    yearFilter: string = "";

    constructor(protected formService: OGEForm450Service,
        protected userService: CurrentUserService,
        protected settingsService: SettingsService,
        protected extensionService: ExtensionRequestService,
        protected employeeListService: EmployeeListService,
        protected snackBar: MatSnackBar,
        protected router: Router) {
    }

    abstract formSaved(form: OgeForm450): void;
    abstract reloadForms(): void;

    loadReviewers() {
        this.employeeListService.getReviewers()
            .then(response => {
                this.reviewers.push({ text: 'Not Assigned', value: 0, group: "" });

                response.forEach(emp => {
                    let item: SelectItem = {
                        text: emp.displayName,
                        value: emp.id,
                        group: ""
                    };

                    this.reviewers.push(item);
                })
            });
    }

    loadExtensions(): void {
        this.extensionService.getPending()
            .then(response => {
                this.extensions = response;

                this.extensionWidget.title = this.extensions.length.toString();
                this.extensionWidget.text = "Extension Request" + ((this.extensions.length == 1) ? "" : "s");
                this.extensionWidget.actionText = "click to review";

                if (this.extensions.length > 0)
                    this.extensionWidget.color = "warning";
                else
                    this.extensionWidget.color = "success";
            });
    }

    viewForm(form: OgeForm450) {
        this.gotoDetail(form.id);
    }

    gotoDetail(id: number): void {
        this.router.navigate(['/form', id]);
    }

    onSubmittedClick() {
        this.selectedIndex = 0;

        this.dtForms.resetFilters();
        this.dtForms.filter.formStatus = "Submitted";
    }

    onExtensionClick() {
        this.selectedIndex = 1;
    }

    onOverdueClick() {
        this.selectedIndex = 0;

        this.dtForms.resetFilters();
        this.dtForms.filter.formFlags = "Overdue";
    }

    get formAccessLevel() {
        return this.userService.isInRole(Roles.Admin) ? AccessLevels.Edit : (this.userService.isInRole(Roles.Reviewer) ? AccessLevels.Assign : AccessLevels.ReadOnly);
    }

    saveForm(form: OgeForm450) {
        if (form) {
            this.formService.save(form).then(response => {
                var message = "";

                if (response.formStatus == FormStatus.CANCELED) {
                    this.forms = this.forms.filter(x => x.id != form.id);

                    message = "Form Canceled Successfully";
                }
                else {
                    this.forms.filter(x => x.id == form.id)[0].dueDate = response.dueDate;
                    this.forms.filter(x => x.id == form.id)[0].assignedTo = response.assignedTo;
                    this.forms.filter(x => x.id == form.id)[0].assignedToUpn = response.assignedToUpn;
                    this.forms.filter(x => x.id == form.id)[0].formStatus = response.formStatus;

                    message = "Form Updated Successfully";
                }

                this.formSaved(response);

                this.snackBar.open(message, "", {
                    duration: 5000
                });
            });

            this.drawer.close();
        }
    }

    cancelForm(form: OgeForm450) {
        // This check should be redundant, but that's ok
        if (this.userService.isInRole(Roles.Admin)) {
            var msg = "Proceeding with this action will cancel the " + form.year + " " + form.reportingStatus + " OGE Form 450 for " + form.employeesName + ".  Click OK to proceed or Cancel to cancel this action.";

            if (confirm(msg)) {
                form.formStatus = FormStatus.CANCELED;
                this.saveForm(form);
            }
        }
    }

    certifyForms(type: string) {
        if (type == 'unchanged')
            this.certifyUnchangedForms();
        else if (type == 'blank')
            this.certifyBlankForms();
    }

    certifyBlankForms() {
        if (confirm("Proceeding with this action will auto certify all 'blank' forms  for annual filers only.  All submitted forms where the filer answered 'no' to all 5 sections will be certified.  Click OK to proceed or Cancel to cancel this action.")) {
            this.formService.certifyForms('blank').then(forms => {
                this.reloadForms();
            });
        }
    }

    certifyUnchangedForms() {
        if (confirm("Proceeding with this action will auto certify all 'unchanged' forms.  All submitted forms where the filer made no changes to their previous year's certified form.  Click OK to proceed or Cancel to cancel this action.")) {
            this.formService.certifyForms('unchanged').then(forms => {
                this.reloadForms();
            });
        }
    }

    assignForms(forms: OgeForm450[]) {
        this.selectedForms = forms;
        this.drawer.open();
    }

    onFormSelect(form: OgeForm450): void {
        this.selectedForm = form;

        this.drawer.open();
    }

    onExtensionSelect(extension: ExtensionRequest): void {
        this.selectedExtension = extension;

        this.drawer.open();
    }

    drawerClosing(): void {
        this.selectedForm = undefined;
        this.selectedExtension = undefined;
        this.selectedForms = undefined;
    }

    saveExtension(extension: ExtensionRequest): void {
        this.extensionService.save(extension).then(response => {
            this.snackBar.open("Extension Saved Successfully", "", {
                duration: 5000
            });
            this.drawer.close();
            this.loadExtensions();
        });
    }

    approveExtension(extension: ExtensionRequest): void {
        extension.status = ExtensionStatus.APPROVED;
        this.saveExtension(extension);
    }

    rejectExtension(extension: ExtensionRequest): void {
        extension.status = ExtensionStatus.REJECTED;
        this.saveExtension(extension);
    }
}
