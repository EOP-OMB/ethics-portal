import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsViewComponent } from './views/events-view/events-view.component';
import { EventRequestFormComponent } from './components/event-request-form/event-request-form.component';
import { EventsRoutingModule } from './events-routing.module';
import { EventResolver } from './resolvers/event.resolver';
import { EventRequestViewComponent } from './views/event-request-view/event-request-view.component';
import { PreventUnsavedChangesGuard } from '../oge-form-450/guards/prevent-unsaved-changes.guard';
import { SharedModule } from '@shared/shared.module';
import { AttendeeComponent } from './components/attendee/attendee.component';

@NgModule({
    declarations: [
        EventsViewComponent,
        EventRequestFormComponent,
        EventRequestViewComponent,
        AttendeeComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        EventsRoutingModule,
    ],
    providers: [
        EventResolver,
        PreventUnsavedChangesGuard
    ]
})
export class EventsModule { }
