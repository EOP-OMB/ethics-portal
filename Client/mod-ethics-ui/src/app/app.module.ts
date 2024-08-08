import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModFrameworkConfig, ModFrameworkModule } from 'mod-framework';
import { environment } from '@src/environments/environment';
import { PortalModule } from '@portal/portal.module';
import { SharedModule } from '@shared/shared.module';
import { OgeForm450Module } from '@oge450/oge-form-450.module';
import { EventsModule } from '@events/events.module';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';
import { MaintenanceViewComponent } from './views/maintenance-view/maintenance-view.component';



const modConfig: ModFrameworkConfig = {
    loginSiteUrl: environment.apiUrl,
    loadingDelay: 750,
    urlsToSkip: ['employee/image', 'employee/search/*'],
    helpOptions: [],
    profileUrl: "https://portfolio.omb.gov/portfolio",
    showHelp: false,
    showSearch: false,
    userOptions: []
}

@NgModule({
    declarations: [
        AppComponent,
        MaintenanceViewComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ModFrameworkModule.forRoot(modConfig),
        SharedModule,
        PortalModule,
        OgeForm450Module,
        EventsModule,
        EditorModule,
        ButtonsModule,
        DateInputsModule,
        DialogsModule,
        DropDownsModule,
        InputsModule,
        ToolBarModule,
        TreeViewModule,
        UploadsModule,
        HttpClientModule,
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
