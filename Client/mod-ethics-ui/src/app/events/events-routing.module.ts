import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { EventResolver } from './resolvers/event.resolver';
import { EventRequestViewComponent } from './views/event-request-view/event-request-view.component';
import { EventsViewComponent } from './views/events-view/events-view.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard'
    },
    {
        path: 'request/:id',
        component: EventRequestViewComponent,
        resolve: {
            request: EventResolver
        },
        //canDeactivate: [PreventUnsavedChangesGuard],
    },
    {
        path: 'dashboard',
        component: EventsViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventsRoutingModule { }
