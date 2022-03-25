import { Component, OnInit, ViewChild } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { SelectItem } from '@shared/models/select-item.interface';

import { OGEForm450Service } from '@shared/services/oge-form-450.service';
import { Router } from '@angular/router';
import { FormStatus } from '@shared/static/form-status.const';
import { MatDrawer } from '@angular/material/sidenav';
import { FormTableComponent } from '@shared/components/form-table/form-table.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserService } from 'mod-framework';
import { Roles } from '@shared/static/roles.const';
import { Lookups } from '@shared/static/lookups.static';
import { SettingsService } from '@shared/services/settings.service';
import { Settings } from '@shared/models/settings.model';
import { AccessLevels } from '@shared/components/form-details/form-details.component';
import { EmployeeListService } from '@shared/services/employee-list.service';
import { FormViewBaseComponent } from '@shared/views/form-view-base/form-view-base.component';
import { ExtensionRequestService } from '@shared/services/extension-request.service';

@Component({
    selector: 'app-all-extensions-view',
    templateUrl: './all-extensions-view.component.html',
    styleUrls: ['./all-extensions-view.component.scss']
})
export class AllExtensionsViewComponent extends FormViewBaseComponent implements OnInit {

    constructor(protected formService: OGEForm450Service,
        protected userService: CurrentUserService,
        protected settingsService: SettingsService,
        protected extensionService: ExtensionRequestService,
        protected employeeListService: EmployeeListService,
        protected snackBar: MatSnackBar,
        protected router: Router) {
        super(formService, userService, settingsService, extensionService, employeeListService, snackBar, router);
    }

    ngOnInit(): void {
        this.years = Lookups.YEARS;

        this.settingsService.get().then(settings => {
            this.settings = settings;
            this.yearFilter = settings.currentFilingYear.toString();

            this.loadExtensions();
        });

        this.loadReviewers();
    }

    loadExtensions(): void {
        this.extensionService.getAll()
            .then(response => {
                this.extensions = response;
            });
    }

    get formAccessLevel() {
        // Only allow edits on current filing year. 
        return this.yearFilter == this.settings.currentFilingYear.toString() ? AccessLevels.Edit : AccessLevels.ReadOnly;
    }

    get selectable(): boolean {
        // Only allow assignments on current filing year.
        return this.yearFilter == this.settings.currentFilingYear.toString();
    }

    formSaved(form: OgeForm450): void {
        // Not used in this view
    }

    reloadForms(): void {
        // Not used in this view
    }
}
