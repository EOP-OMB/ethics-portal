import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormViewComponent } from './views/form-view/form-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { ReviewerViewComponent } from './views/reviewer-view/reviewer-view.component';
import { FormComponent } from './components/form/form.component';
import { FormCompareComponent } from './components/form-compare/form-compare.component';
import { HelpfulLinksComponent } from './components/helpful-links/helpful-links.component';
import { ExamplesComponent } from './components/examples/examples.component';
import { SharedModule } from '@shared/shared.module';
import { PrintPageHeaderComponent } from './components/print-page-header/print-page-header.component';
import { IntroComponent } from './components/intro/intro.component';
import { OgeForm450RoutingModule } from './oge-form-450-routing.module';
import { OGEForm450Resolver } from './resolvers/oge-form-450.resolver';
import { PreviousOGEForm450Resolver } from './resolvers/previous-oge-form-450.resolver';
import { SupportContactsComponent } from './components/support-contacts/support-contacts.component';
import { RedirectGuard } from './guards/redirect.guard';

@NgModule({
    declarations: [
        FormViewComponent,
        HomeViewComponent,
        ReviewerViewComponent,
        FormComponent,
        FormCompareComponent,
        HelpfulLinksComponent,
        ExamplesComponent,
        PrintPageHeaderComponent,
        IntroComponent,
        SupportContactsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        OgeForm450RoutingModule
    ],
    providers: [
        OGEForm450Resolver,
        PreviousOGEForm450Resolver,
        RedirectGuard
    ]
})
export class OgeForm450Module { }
