import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrentUserService } from 'mod-framework';
import { ExtensionRequestService } from '@shared/services/extension-request.service';
import { FormData } from '@oge450/models/form-data.model';
import { OGEForm450Service } from '@shared/services/oge-form-450.service';
import { SettingsService } from '@shared/services/settings.service';
import { Settings } from '@shared/models/settings.model';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { ExtensionStatus } from '@shared/static/extension-status.const';
import { ExtensionRequest } from '@shared/models/extension-request.model';
import { MatDrawer } from '@angular/material/sidenav';
import { Employee } from '@shared/models/employee.model';
import { Guidance } from '@shared/models/guidance.model';
import { GuidanceService } from '@shared/services/guidance.service';
import { Helper } from '@shared/static/helper.funcs';
import { ProfilePanel } from '../../models/profile-panel.model';
import { FormStatus } from '@shared/static/form-status.const';

import { AccessLevels } from '@shared/components/form-details/form-details.component';
import { Roles } from '@shared/static/roles.const';
import { EmployeeListService } from '@shared/services/employee-list.service';
import { FormViewBaseComponent } from '@shared/views/form-view-base/form-view-base.component';
import { EmployeeService } from '@shared/services/employee.service';
import { environment } from '../../../../environments/environment.stage';

@Component({
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent extends FormViewBaseComponent implements OnInit, AfterViewInit {

    @ViewChild(MatAccordion)
    accordion?: MatAccordion;

    public timeline: any[] = [];
    public options: any[] = [];

    formData!: FormData;
    settings: Settings = new Settings();
    forms: OgeForm450[] = [];
    guidance: Guidance[] = [];

    hiddenCols = ['employeeName', 'filerType'];

    recentGuidanceCount: number = 0;
    guidancePanel: ProfilePanel = new ProfilePanel();
    formPanel: ProfilePanel = new ProfilePanel();
    trainingPanel: ProfilePanel = new ProfilePanel();
    eventPanel: ProfilePanel = new ProfilePanel();

    selectedGuidance?: Guidance;
    selectedEmployee?: Employee;

    employeeId?: number;

    public employee: Employee = new Employee();
    
    public get canEdit(): boolean {
        return this.userService.isInRole(Roles.Admin);
    }

    constructor(protected userService: CurrentUserService,
        protected route: ActivatedRoute,
        protected router: Router,
        protected extensionRequestService: ExtensionRequestService,
        protected formService: OGEForm450Service,
        protected settingsService: SettingsService,
        protected guidanceService: GuidanceService,
        protected employeeListService: EmployeeListService,
        protected employeeService: EmployeeService,
        protected snackBar: MatSnackBar) {
        super(formService, userService, settingsService, extensionRequestService, employeeListService, snackBar, router);
    }

    ngAfterViewInit(): void {

    }

    ngOnInit(): void {
        this.loadSettings();

        this.route.params.subscribe((qp: Params) => {
            this.employeeId = qp['id'];

            this.loadForms();
            this.loadEmployee();
            this.loadEvents();
            this.loadTraining();
            this.loadGuidance();
        });
    }

    loadEvents() {
        this.eventPanel.color = "info";
        this.eventPanel.text = "Coming Soon";
        this.eventPanel.showAdd = false;
        this.eventPanel.icon = "event";
    }

    loadTraining() {
        this.trainingPanel.color = "info";
        this.trainingPanel.text = "Coming Soon";
        this.trainingPanel.showAdd = false;
        this.trainingPanel.icon = "event";
    }

    loadGuidance() {
        let id = this.employeeId ?? this.employee.id;
        this.guidance = [];
        this.guidanceService.getByEmployee(id).then(response => {
            this.guidance = response.sort((a, b) => a.createdTime < b.createdTime ? 1 : a.createdTime > b.createdTime ? -1 : 0);;
            var fromDate = Helper.addDays(new Date(), -7);

            this.recentGuidanceCount = this.guidance.filter(x => (Helper.getDate(x.createdTime.toString()) ?? fromDate) > fromDate).length;

            if (this.recentGuidanceCount > 0) {
                this.guidancePanel.text = this.recentGuidanceCount + ' New Guidance';
                this.guidancePanel.color = "info";
                this.guidancePanel.icon = "mark_email_unread";
            }
            else {
                this.guidancePanel.text = "No New Guidance";
                this.guidancePanel.color = "success";
                this.guidancePanel.icon = "mark_email_read";
            }
        });
    }

    loadEmployee() {
        this.route.data.subscribe(data => {
            this.employee = data.employee;
        });
    }

    loadSettings(): Promise<void> {
        return this.settingsService.get()
            .then(response => {
                this.settings = response;
            });
    }

    formSaved(form: OgeForm450): void {
        this.setFormStatus(form);
    }

    reloadForms(): void {
        this.loadForms();
    }

    setForms(forms: OgeForm450[]): void {
        if (forms.length > 0) {
            forms = forms.sort((a, b) => a.year < b.year ? 1 : a.year > b.year ? -1 : 0);
            let latestForm = forms[0];

            if (latestForm) {
                this.setFormStatus(latestForm);

                this.formData = new FormData();
                this.formData.form = latestForm;
                this.formData.setStatus();
            }
        } else {
            // No Forms
            this.setFormStatus(undefined);
        }

        this.forms = forms;
    }

    public get canExtend(): boolean {
        return this.userService.user.upn.toLowerCase() == this.selectedForm?.filer.toLowerCase() && this.selectedForm?.isOverdue;
    }

    setFormStatus(form?: OgeForm450) {

        if (!form) {
            this.formPanel.text = "Not Assigned";
            this.formPanel.color = "primary";
            this.formPanel.icon = "do_not_disturb";
        }
        else if (form.formStatus == FormStatus.CERTIFIED || form.formStatus == FormStatus.SUBMITTED || form.formStatus == FormStatus.RE_SUBMITTED || form.formStatus == FormStatus.CANCELED) {
            this.formPanel.text = form.formStatus;

            if (form.formStatus == FormStatus.SUBMITTED || form.formStatus == FormStatus.RE_SUBMITTED) {
                this.formPanel.color = "primary";
                this.formPanel.icon = "move_to_inbox";
            }
            else if (form.formStatus == FormStatus.CERTIFIED) {
                this.formPanel.color = "success";
                this.formPanel.icon = "verified";
            }
        } else {
            if (form.formStatus == FormStatus.MISSING_INFORMATION) {
                this.formPanel.color = "warning";
                this.formPanel.icon = "feed";
            }
            else {
                var dueDate = new Date(form.dueDate);
                var today = new Date();
                if (dueDate < today) {
                    this.formPanel.text = "Overdue";
                    this.formPanel.color = "danger";
                    this.formPanel.icon = "schedule";
                }
                else {
                    var days = Helper.daysBetween(today, dueDate);

                    if (days > 14) {
                        this.formPanel.color = "info";
                    }
                    else {
                        this.formPanel.color = "warning";
                    }

                    this.formPanel.text = "Due in " + days.toString() + " days";
                    this.formPanel.icon = "event"
                }
            }
        }
    }

    loadForms(): void {
        if (this.employeeId) {
            this.formService.getFormsByEmployee(this.employeeId).then(forms => {
                this.setForms(forms);
            });
        }
        else {
            this.formService.getMyForms().then(forms => {
                this.setForms(forms);
            });
        }
    }

    gotoDetail(id: number): void {
        this.router.navigate(['/form', id]);
    }

    closeExtensionRequest(evt: any) {
        if (evt) {
            // close modal
            $('#extension-modal').modal('hide');
        }
    }

    onFilingClick() {
        this.router.navigate(['/form', this.formData.form.id]);
    }

    addExtension(form: OgeForm450) {
        if (this.selectedForm)
            this.selectedForm = undefined;

        this.extensionRequestService.get(form.id).then(response => {
            this.selectedExtension = response;
            this.selectedExtension.form = this.formData.form;
            this.drawer.open();
        });
    }

    drawerClosing(): void {
        this.selectedExtension = undefined;
        this.selectedGuidance = undefined;
        this.selectedForm = undefined;
        this.selectedEmployee = undefined;
    }

    addGuidance() {
        this.showGuidance(new Guidance());
    }

    gotoEmployee(employee: Employee): void {
        if (employee.id != this.employee.id) {
            this.drawer.close();
        }

        this.router.navigate(['/profile/', employee.id]);
    }

    saveGuidance(guidance: Guidance): void {
        this.guidanceService.save(guidance).then(response => {
            this.loadGuidance();
            this.drawer.close();
        });
    }

    onGuidanceSelect(guidance: Guidance): void {
        this.guidanceService.get(guidance.id).then(response => {
            this.showGuidance(response);
        });
    }

    showGuidance(guidance: Guidance): void {
        this.selectedGuidance = guidance;
        this.drawer.open();
    }

    get employeeType(): string {
        var type = this.employee.type;

        if (this.employee.subtype) {
            type += " - " + this.employee.subtype;
        }

        return type;
    }

    editEmployeeClick(employee: Employee) {
        this.selectedEmployee = employee;
        this.drawer.open();
    }

    saveEmployee(employee: Employee): void {
        this.employeeService.save(employee).then(response => {
            this.employee = response;
            this.drawer.close();
        });
    }

    deleteGuidance(guidance: Guidance): void {
        this.guidanceService.delete(guidance.id).then(responst => {
            this.loadGuidance();
            this.drawer.close();
        });
    }

    gotoPortfolio(): void {
        window.open(environment.portfolioUrl + this.employee.id, "_blank");
    }
}
