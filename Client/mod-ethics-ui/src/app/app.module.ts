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
        AppComponent
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
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
