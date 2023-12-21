import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationTemplateEditComponent } from '@shared/components/notification-template-edit/notification-template-edit.component';

import { EmployeeViewComponent } from './views/employee-view/employee-view.component';
import { EoyReportViewComponent } from './views/eoy-report-view/eoy-report-view.component';
import { EthicsTrainingViewComponent } from './views/ethics-training-view/ethics-training-view.component';
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
        path: 'guidance',
        component: GuidanceViewComponent
    },
    {
        path: 'training',
        component: EthicsTrainingViewComponent
    },
    {
        path: 'reports',
        component: ReportsViewComponent
    },
    {
        path: 'eoy-report',
        component: EoyReportViewComponent
    },
    {
        path: 'notifications',
        component: NotificationTemplateEditComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
