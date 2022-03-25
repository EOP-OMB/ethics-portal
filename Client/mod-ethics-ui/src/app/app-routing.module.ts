import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService } from 'mod-framework';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule),
    },
    {
        path: 'oge450',
        loadChildren: () => import('./oge-form-450/oge-form-450.module').then(m => m.OgeForm450Module),
    },
    {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [RoleGuardService],
        data: {
            expectedRoles: ["Admin", "OGESupport"]
        }
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
