import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { RedirectGuard } from './guards/redirect.guard';
import { OGEForm450Resolver } from './resolvers/oge-form-450.resolver';
import { PreviousOGEForm450Resolver } from './resolvers/previous-oge-form-450.resolver';
import { FormViewComponent } from './views/form-view/form-view.component';
import { ReviewerViewComponent } from './views/reviewer-view/reviewer-view.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: ReviewerViewComponent
    },
    {
        path: 'myform',
        component: FormViewComponent,
        resolve: {
            form: OGEForm450Resolver,
            prev: PreviousOGEForm450Resolver
        },
        //canDeactivate: [PreventUnsavedChangesGuard],
    },
    {
        path: 'form/:id',
        component: FormViewComponent,
        resolve: {
            form: OGEForm450Resolver,
            prev: PreviousOGEForm450Resolver
        },
        //canDeactivate: [PreventUnsavedChangesGuard],
    },
    //{
    //    path: 'extension/:id',
    //    component: ExtensionRequestComponent,
    //    resolve: {
    //        form: OGEForm450Resolver
    //    },
    //    canActivate: [LoggedInGuard, MaintenanceGuard],
    //},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OgeForm450RoutingModule { }
