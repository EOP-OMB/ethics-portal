import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileResolver } from './services/profile.resolver';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/profile',
        pathMatch: 'full'
    },
    {
        path: 'profile',
        component: ProfileViewComponent,
        resolve: {
            employee: ProfileResolver
        },
    },
    {
        path: 'profile/:id',
        component: ProfileViewComponent,
        resolve: {
            employee: ProfileResolver
        },
        //canDeactivate: [PreventUnsavedChangesGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PortalRoutingModule { }
