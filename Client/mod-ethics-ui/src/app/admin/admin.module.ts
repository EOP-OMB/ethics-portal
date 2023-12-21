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
import { GuidanceViewComponent } from './views/guidance-view/guidance-view.component';
import { ReportsViewComponent } from './views/reports-view/reports-view.component';
import { EoyReportViewComponent } from './views/eoy-report-view/eoy-report-view.component';
import { OgeForm450StatusChartComponent } from './components/oge-form450-status-chart/oge-form450-status-chart.component';
import { TrainingChartComponent } from './components/training-chart/training-chart.component';
import { EventRequestChartComponent } from './components/event-request-chart/event-request-chart.component';
import { EthicsTrainingViewComponent } from './views/ethics-training-view/ethics-training-view.component';

@NgModule({
    declarations: [
        SettingsViewComponent,
        SettingsComponent,
        EditLinksComponent,
        EditContactsComponent,
        EmployeeTableComponent,
        EmployeeViewComponent,
        GuidanceViewComponent,
        ReportsViewComponent,
        EoyReportViewComponent,
        OgeForm450StatusChartComponent,
        TrainingChartComponent,
        EventRequestChartComponent,
        EthicsTrainingViewComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModule,
    ]
})
export class AdminModule { }
