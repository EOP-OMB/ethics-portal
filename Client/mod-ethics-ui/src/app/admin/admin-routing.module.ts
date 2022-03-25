import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllExtensionsViewComponent } from './views/all-extensions-view/all-extensions-view.component';
import { AllFormsViewComponent } from './views/all-forms-view/all-forms-view.component';
import { EmployeeViewComponent } from './views/employee-view/employee-view.component';
import { GuidanceViewComponent } from './views/guidance-view/guidance-view.component';
import { ReportsViewComponent } from './views/reports-view/reports-view.component';
import { SettingsViewComponent } from './views/settings-view/settings-view.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsViewComponent
    },
    {
        path: 'settings',
        component: SettingsViewComponent
    },
    {
        path: 'employees',
        component: EmployeeViewComponent
    },
    {
        path: 'forms',
        component: AllFormsViewComponent
    },
    {
        path: 'extensions',
        component: AllExtensionsViewComponent
    },
    {
        path: 'guidance',
        component: GuidanceViewComponent
    },
    {
        path: 'reports',
        component: ReportsViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
