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
import { FormViewBaseComponent } from '@shared/views/form-view-base/form-view-base.component';
import { SettingsService } from '@shared/services/settings.service';

@Component({
    selector: 'app-reviewer-view',
    templateUrl: './reviewer-view.component.html',
    styleUrls: ['./reviewer-view.component.scss']
})
export class ReviewerViewComponent extends FormViewBaseComponent implements OnInit {
    constructor(protected formService: OGEForm450Service,
        protected userService: CurrentUserService,
        protected extensionService: ExtensionRequestService,
        protected settingsService: SettingsService,
        protected employeeListService: EmployeeListService,
        protected snackBar: MatSnackBar,
        protected router: Router) {
        super(formService, userService, settingsService, extensionService, employeeListService, snackBar, router);
    }

    ngOnInit(): void {
        this.loadReviewableForms();

        this.loadExtensions();

        this.loadReviewers();
    }

    loadReviewableForms() {
        this.formService
            .getReviewableForms()
            .then(forms => {
                this.forms = forms;

                this.updateFormWidgets();
            });
    }

    updateFormWidgets(): void {
        var submittedForms = this.forms.filter(x => x.formStatus == FormStatus.SUBMITTED || x.formStatus == FormStatus.RE_SUBMITTED)

        this.submittedWidget.title = submittedForms.length.toString();
        this.submittedWidget.text = "Submitted";
        this.submittedWidget.actionText = "require reviewer action";

        if (this.submittedWidget.title == "0")
            this.submittedWidget.color = "success";
        else
            this.submittedWidget.color = "info";

        this.overdueWidget.title = this.forms.filter(x => x.isOverdue == true).length.toString();
        this.overdueWidget.text = "Overdue";
        this.overdueWidget.actionText = "click to view";

        if (this.overdueWidget.title == "0")
            this.overdueWidget.color = "success";
        else
            this.overdueWidget.color = "danger";
    }

    formSaved(form: OgeForm450): void {
        this.updateFormWidgets();       
    }   

    reloadForms(): void {
        this.loadReviewableForms();
    }
}
