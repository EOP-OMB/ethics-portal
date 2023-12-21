import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { PortalRoutingModule } from './portal-routing.module';
import { IconWidgetComponent } from './components/icon-widget/icon-widget.component';
import { SharedModule } from '@shared/shared.module';
import { CardComponent } from './components/card/card.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { ProfileResolver } from './services/profile.resolver';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EthicsItemComponent } from './components/ethics-item/ethics-item.component';
import { DatePipe } from '@angular/common';
import { OutsidePositionFormComponent } from './components/outside-position-form/outside-position-form.component';
import { TrainingVideoViewComponent } from './views/training-video-view/training-video-view.component';
import { OutsidePositionResolver } from './resolvers/outside-position.resolver';
import { OutsidePositionViewComponent } from './views/outside-position-view/outside-position-view.component';
import { OutsidePositionsViewComponent } from './views/outside-positions-view/outside-positions-view.component';

@NgModule({
    declarations: [
        HomeViewComponent,
        IconWidgetComponent,
        CardComponent,
        ProfileViewComponent,
        TimelineComponent,
        EthicsItemComponent,
        OutsidePositionFormComponent,
        TrainingVideoViewComponent,
        OutsidePositionViewComponent,
        OutsidePositionsViewComponent,
    ],
    providers: [
        ProfileResolver,
        DatePipe,
        OutsidePositionResolver
    ],
    imports: [
        CommonModule,
        SharedModule,
        PortalRoutingModule
    ]
})
export class PortalModule { }
