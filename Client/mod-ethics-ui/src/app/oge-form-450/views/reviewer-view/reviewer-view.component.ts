import { Component, OnInit, ViewChild } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { Widget } from '@shared/models/widget.model';
import { SelectItem } from '@shared/models/select-item.interface';

import { ExtensionRequest } from '@shared/models/extension-request.model';
import { OGEForm450Service } from '@shared/services/oge-form-450.service';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FormTableComponent } from '@shared/components/form-table/form-table.component';
import { EmployeeListService } from '@shared/services/employee-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserService } from 'mod-framework';
import { Roles } from '@shared/static/roles.const';
import { AccessLevels } from '@shared/components/form-details/form-details.component';
import { SettingsService } from '@shared/services/settings.service';
import { OgeForm450Summary } from '@shared/models/oge-form-450-summary.model';
import { ExtensionTableComponent } from '@shared/components/extension-table/extension-table.component';
import { FormStatus } from '@shared/static/form-status.const';
import { Employee } from '@shared/models/employee.model';
import { ExtensionStatus } from '@shared/static/extension-status.const';
import { ExtensionRequestService } from '@shared/services/extension-request.service';

@Component({
    selector: 'app-reviewer-view',
    templateUrl: './reviewer-view.component.html',
    styleUrls: ['./reviewer-view.component.scss']
})
export class ReviewerViewComponent implements OnInit {
    @ViewChild('dtForms')
    dtForms!: FormTableComponent;
    @ViewChild('dtExtensions')
    dtExtensions!: ExtensionTableComponent;

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer;

    reviewers: SelectItem[] = [];

    submittedWidget: Widget = new Widget();
    extensionWidget: Widget = new Widget();
    overdueWidget: Widget = new Widget();
    readyToCertWidget: Widget = new Widget();

    selectedForm?: OgeForm450;
    selectedExtension?: ExtensionRequest;
    selectedForms?: OgeForm450[];

    selectedIndex: number = 0; // 0 - Forms tab, 1 - Extensions tab

    get formAccessLevel() {
        return this.userService.isInRole(Roles.Admin) ? AccessLevels.Edit : (this.userService.isInRole(Roles.Reviewer) ? AccessLevels.Assign : AccessLevels.ReadOnly);
    }

    constructor(protected formService: OGEForm450Service,
        protected userService: CurrentUserService,
        protected settingsService: SettingsService,
        protected employeeListService: EmployeeListService,
        protected extensionService: ExtensionRequestService,
        protected snackBar: MatSnackBar,
        protected router: Router) {
        
    }

    ngOnInit(): void {
        this.loadSummaryData();

        this.loadReviewers();
    }

    loadReviewers() {
        this.employeeListService.getReviewers()
            .then(response => {
                this.reviewers.push({ text: 'Not Assigned', value: "na", group: "" });
                
                response.forEach(emp => {
                    let item: SelectItem = {
                        text: emp.displayName,
                        value: emp.upn,
                        group: ""
                    };

                    this.reviewers.push(item);
                })
            });
    }

    loadSummaryData() {
        this.formService
            .getSummary()
            .then(response => {
                this.updateFormWidgets(response);
            });
    }

    updateFormWidgets(summary: OgeForm450Summary): void {
        this.submittedWidget.title = summary.submittedForms.toString();
        this.submittedWidget.text = "Submitted";
        this.submittedWidget.actionText = "require reviewer action";

        if (this.submittedWidget.title == "0")
            this.submittedWidget.color = "success";
        else
            this.submittedWidget.color = "info";

        this.readyToCertWidget.title = summary.readyToCertify.toString();
        this.readyToCertWidget.text = "Review Complete";
        this.readyToCertWidget.actionText = "ready to certify";

        this.readyToCertWidget.color = "success";

        this.overdueWidget.title = summary.overdueForms.toString();
        this.overdueWidget.text = "Overdue";
        this.overdueWidget.actionText = "click to view";

        if (this.overdueWidget.title == "0")
            this.overdueWidget.color = "success";
        else
            this.overdueWidget.color = "danger";

        this.extensionWidget.title = summary.extensions.toString();
        this.extensionWidget.text = "Extension" + ((summary.extensions == 1) ? "" : "s");
        this.extensionWidget.actionText = "click to review";

        if (summary.extensions > 0)
            this.extensionWidget.color = "warning";
        else
            this.extensionWidget.color = "success";
    }

    formSaved(form: OgeForm450): void {
        this.loadSummaryData();      
    }   

    reloadForms(): void {
        this.loadSummaryData();
    }

    drawerClosing(): void {
        this.selectedForm = undefined;
        this.selectedExtension = undefined;
        this.selectedForms = undefined;
    }

    onSubmittedClick() {
        this.selectedIndex = 0;

        this.dtForms.filterBy("submitted");
    }

    onReadyToCertClick() {
        this.selectedIndex = 0;

        this.dtForms.filterBy("readyToCert");
    }

    onExtensionClick() {
        this.selectedIndex = 1;

        this.dtExtensions.filterBy("pending");
    }

    onOverdueClick() {
        this.selectedIndex = 0;

        this.dtForms.filterBy("overdue");
    }

    onFormSelect(form: OgeForm450): void {
        this.formService.get(form.id).then(response => {
            this.selectedForm = response;

            this.drawer.open();
        });
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

    onExtensionSelect(extension: ExtensionRequest): void {
        this.selectedExtension = extension;

        this.drawer.open();
    }

    assignMultiple(forms: OgeForm450[], employeeUpn: string): void {
        forms.forEach(x => {
            this.assignForm(x.id, employeeUpn);
        });
    }

    assignForm(id: number, employeeUpn: string) {
        
        this.formService.assignForm(id, employeeUpn).then(response => {
            var message = "";

            if (response.formStatus == FormStatus.CANCELED) {

                message = "Form Canceled Successfully";
            }
            else {
                message = "Form Updated Successfully";
            }

            this.formSaved(response);

            this.snackBar.open(message, "", {
                duration: 5000
            });

            this.dtForms.search();
        });

        this.drawer.close();
    }

    saveForm(form: OgeForm450) {
        if (form) {
            this.formService.save(form).then(response => {
                var message = "";

                if (response.formStatus == FormStatus.CANCELED) {

                    message = "Form Canceled Successfully";
                }
                else {
                    message = "Form Updated Successfully";
                }

                this.formSaved(response);

                this.snackBar.open(message, "", {
                    duration: 5000
                });

                this.dtForms.search();
            });

            this.drawer.close();
        }
    }

    viewForm(form: OgeForm450) {
        this.gotoDetail(form.id);
    }

    gotoDetail(id: number): void {
        this.router.navigate(['/form', id]);
    }

    approveExtension(extension: ExtensionRequest): void {
        extension.status = ExtensionStatus.APPROVED;
        this.saveExtension(extension);
    }

    rejectExtension(extension: ExtensionRequest): void {
        extension.status = ExtensionStatus.REJECTED;
        this.saveExtension(extension);
    }

    saveExtension(extension: ExtensionRequest): void {
        this.extensionService.save(extension).then(response => {
            this.snackBar.open("Extension Saved Successfully", "", {
                duration: 5000
            });
            this.drawer.close();
            this.loadSummaryData();
        });
    }
    public get canExtend(): boolean {
        var ret = (this.selectedForm?.formStatus == FormStatus.NOT_STARTED || this.selectedForm?.formStatus == FormStatus.DRAFT || this.selectedForm?.formStatus == FormStatus.MISSING_INFORMATION) &&
            (this.selectedForm?.filer.toLowerCase() == this.userService.user.upn.toLowerCase() || this.userService.isInRole(Roles.Admin) || this.userService.isInRole(Roles.Support));

        return ret;
    }

    addExtension(form: OgeForm450) {
        if (this.selectedForm)
            this.selectedForm = undefined;

        this.extensionService.get(form.id).then(response => {
            this.selectedExtension = response;
            this.selectedExtension.form = form;
            this.drawer.open();
        });
    }

    cancelForm(form: OgeForm450) {
        form.formStatus = FormStatus.CANCELED;
        this.saveForm(form);
    }
}
