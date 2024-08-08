import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService } from 'mod-framework';
import { MaintenanceGuard } from './shared/services/maintenance.guard';
import { MaintenanceViewComponent } from './views/maintenance-view/maintenance-view.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule),
        canActivate: [MaintenanceGuard]
    },
    {
        path: 'oge450',
        loadChildren: () => import('./oge-form-450/oge-form-450.module').then(m => m.OgeForm450Module),
        canActivate: [MaintenanceGuard]
    },
    {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
        canActivate: [MaintenanceGuard]
    },
    {
        path: 'portal',
        loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule),
        canActivate: [ MaintenanceGuard ]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [RoleGuardService, MaintenanceGuard],
        data: {
            expectedRoles: ["Admin", "OGESupport", "FOIA"]
        }
    },
    {
        path: 'maintenance',
        component: MaintenanceViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
