import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatTableFilterModule } from 'mat-table-filter';
import { MatTableExporterModule } from 'mat-table-exporter';

// Kendo
import { EditorModule } from '@progress/kendo-angular-editor';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from "@progress/kendo-angular-buttons";

import { CheckBoxComponent } from './components/controls/check-box/check-box.component';
import { ControlBaseComponent } from './components/controls/control-base/control-base.component';
import { RadioButtonComponent } from './components/controls/radio-button/radio-button.component';
import { ShortTextComponent } from './components/controls/short-text/short-text.component';
import { TextAreaComponent } from './components/controls/text-area/text-area.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormTableComponent } from './components/form-table/form-table.component';
import { WidgetComponent } from './components/widget/widget.component';
import { PhonePipe } from './phone.pipe';
import { FileSizePipe } from './file-size.pipe';
import { ExtensionTableComponent } from './components/extension-table/extension-table.component';
import { FormDetailsComponent } from './components/form-details/form-details.component';
import { FormMultipleEditComponent } from './components/form-multiple-edit/form-multiple-edit.component';
import { ExtensionRequestComponent } from './components/extension-request/extension-request.component';
import { PeoplePickerComponent } from './components/people-picker/people-picker.component';
import { GuidanceTableComponent } from './components/guidance-table/guidance-table.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { GuidanceEditComponent } from './components/guidance-edit/guidance-edit.component';
import { GuidanceDetailComponent } from './components/guidance-detail/guidance-detail.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';
import { UploadComponent } from './components/upload/upload.component';
import { NotificationTemplateEditComponent } from './components/notification-template-edit/notification-template-edit.component';
import { EventRequestTableComponent } from './components/event-request-table/event-request-table.component';
import { FormExportTableComponent } from './components/form-export-table/form-export-table.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UploadInterceptor } from './services/upload.interceptor';
import { EventRequestDetailComponent } from './components/event-request-detail/event-request-detail.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { TrainingTableComponent } from './components/training-table/training-table.component';
import { TrainingFormComponent } from './components/training-form/training-form.component';
import { OutsidePositionDetailComponent } from './components/outside-position-detail/outside-position-detail.component';
import { TrainingExportTableComponent } from './components/training-export-table/training-export-table.component';
import { OutsidePositionsExportTableComponent } from './components/outside-positions-export-table/outside-positions-export-table.component';
import { OutsidePositionsTableComponent } from './components/outside-positions-table/outside-positions-table.component';

@NgModule({
    declarations: [
        CheckBoxComponent,
        ControlBaseComponent,
        RadioButtonComponent,
        ShortTextComponent,
        TextAreaComponent,
        FormTableComponent,
        WidgetComponent,
        PhonePipe,
        FileSizePipe,
        ExtensionTableComponent,
        FormDetailsComponent,
        FormMultipleEditComponent,
        ExtensionRequestComponent,
        PeoplePickerComponent,
        GuidanceTableComponent,
        EmployeeProfileComponent,
        GuidanceEditComponent,
        GuidanceDetailComponent,
        EmployeeEditComponent,
        EmployeeCardComponent,
        UploadComponent,
        NotificationTemplateEditComponent,
        EventRequestTableComponent,
        FormExportTableComponent,
        EventRequestDetailComponent,
        TrainingTableComponent,
        TrainingFormComponent,
        OutsidePositionDetailComponent,
        TrainingExportTableComponent,
        OutsidePositionsTableComponent,
        OutsidePositionsExportTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,  
        MatIconModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableFilterModule,
        MatSidenavModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatTableExporterModule,
        MatProgressBarModule,
        // Kendo
        EditorModule,
        UploadsModule,
        DateInputsModule,
        InputsModule,
        ButtonsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        ChartsModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableFilterModule,
        MatSidenavModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatProgressBarModule,
        // Kendo
        EditorModule,
        UploadsModule,
        DateInputsModule,
        InputsModule,
        ButtonsModule,
        ChartsModule,
        // Components
        CheckBoxComponent,
        ControlBaseComponent,
        RadioButtonComponent,
        ShortTextComponent,
        TextAreaComponent,
        FormTableComponent,
        WidgetComponent,
        PhonePipe,
        FileSizePipe,
        ExtensionTableComponent,
        FormDetailsComponent,
        FormMultipleEditComponent,
        ExtensionRequestComponent,
        MatTableExporterModule,
        GuidanceTableComponent,
        GuidanceEditComponent,
        PeoplePickerComponent,
        GuidanceDetailComponent,
        EmployeeEditComponent,
        EmployeeCardComponent,
        UploadComponent,
        EventRequestTableComponent,
        FormExportTableComponent,
        EventRequestDetailComponent,
        NgxMaskDirective,
        NgxMaskPipe,
        TrainingTableComponent,
        TrainingFormComponent,
        OutsidePositionDetailComponent,
        OutsidePositionsTableComponent,
        OutsidePositionsExportTableComponent
    ],
    providers: [
        PhonePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UploadInterceptor,
            multi: true,
        },
        provideNgxMask()
    ],
})
export class SharedModule { }
