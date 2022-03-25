import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsViewComponent } from './views/settings-view/settings-view.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SettingsComponent } from './components/settings/settings.component';
import { EditLinksComponent } from './components/edit-links/edit-links.component';
import { EditContactsComponent } from './components/edit-contacts/edit-contacts.component';
import { SharedModule } from '@shared/shared.module';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { EmployeeViewComponent } from './views/employee-view/employee-view.component';
import { AllFormsViewComponent } from './views/all-forms-view/all-forms-view.component';
import { AllExtensionsViewComponent } from './views/all-extensions-view/all-extensions-view.component';
import { GuidanceViewComponent } from './views/guidance-view/guidance-view.component';
import { ReportsViewComponent } from './views/reports-view/reports-view.component';

@NgModule({
    declarations: [
        SettingsViewComponent,
        SettingsComponent,
        EditLinksComponent,
        EditContactsComponent,
        EmployeeTableComponent,
        EmployeeViewComponent,
        AllFormsViewComponent,
        AllExtensionsViewComponent,
        GuidanceViewComponent,
        ReportsViewComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModule,
    ]
})
export class AdminModule { }
