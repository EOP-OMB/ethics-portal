import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileResolver } from './services/profile.resolver';
import { OutsidePositionsViewComponent } from './views/outside-positions-view/outside-positions-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { TrainingVideoViewComponent } from './views/training-video-view/training-video-view.component';
import { OutsidePositionResolver } from './resolvers/outside-position.resolver';
import { OutsidePositionViewComponent } from './views/outside-position-view/outside-position-view.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeViewComponent
    },
    {
        path: 'profile',
        component: ProfileViewComponent,
        resolve: {
            employee: ProfileResolver
        },
    },
    {
        path: 'position/:id',
        component: OutsidePositionViewComponent,
        resolve: {
            position: OutsidePositionResolver
        },
        //canDeactivate: [PreventUnsavedChangesGuard],
    },
    {
        path: 'profile/:id',
        component: ProfileViewComponent,
        resolve: {
            employee: ProfileResolver
        },
        //canDeactivate: [PreventUnsavedChangesGuard],
    },
    {
        path: 'positions',
        component: OutsidePositionsViewComponent
    },
    {
        path: 'training',
        component: TrainingVideoViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PortalRoutingModule { }
