import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { PortalRoutingModule } from './portal-routing.module';
import { IconWidgetComponent } from './components/icon-widget/icon-widget.component';
import { SharedModule } from '@shared/shared.module';
import { CardComponent } from './components/card/card.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { ProfileResolver } from './services/profile.resolver';

@NgModule({
    declarations: [
        HomeViewComponent,
        IconWidgetComponent,
        CardComponent,
        ProfileViewComponent
    ],
    providers: [
        ProfileResolver
    ],
    imports: [
        CommonModule,
        SharedModule,
        PortalRoutingModule
    ]
})
export class PortalModule { }
