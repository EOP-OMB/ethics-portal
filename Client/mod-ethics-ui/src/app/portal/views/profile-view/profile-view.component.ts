import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrentUserService } from 'mod-framework';
import { ExtensionRequestService } from '@shared/services/extension-request.service';
import { OGEForm450Service } from '@shared/services/oge-form-450.service';
import { SettingsService } from '@shared/services/settings.service';
import { Settings } from '@shared/models/settings.model';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { ExtensionRequest } from '@shared/models/extension-request.model';
import { MatDrawer } from '@angular/material/sidenav';
import { Employee } from '@shared/models/employee.model';
import { Guidance } from '@shared/models/guidance.model';
import { GuidanceService } from '@shared/services/guidance.service';
import { FormStatus } from '@shared/static/form-status.const';

import { Roles } from '@shared/static/roles.const';
import { EmployeeListService } from '@shared/services/employee-list.service';
import { EmployeeService } from '@shared/services/employee.service';
import { EthicsItem } from '../../components/ethics-item/ethics-item.component';
import { DatePipe } from '@angular/common';
import { environment } from '@src/environments/environment';
import { EventRequest } from '@shared/models/event-request.model';
import { EventRequestService } from '@shared/services/event-request.service';
import { Training } from '@shared/models/training.model';
import { TrainingService } from '@shared/services/training.service';
import { SelectItem } from '@shared/models/select-item.interface';
import { OutsidePositionStatuses } from '@shared/static/outside-position-statuses.const';
import { OutsidePosition } from '@shared/models/outside-position.model';
import { OutsidePositionService } from '@shared/services/outside-position.service';

@Component({
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, AfterViewInit {

    @ViewChild(MatAccordion)
    accordion?: MatAccordion;

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer;

    selectedForm?: OgeForm450;
    selectedExtension?: ExtensionRequest;
    selectedPosition?: OutsidePosition;
    selectedEvent?: EventRequest;
    selectedTraining?: Training;

    public timeline: any[] = [];
    public options: any[] = [];

    settings: Settings = new Settings();
    forms: OgeForm450[] = [];
    guidance: Guidance[] = [];
    trainings: Training[] = [];
    eventRequests: EventRequest[] = [];
    positions: OutsidePosition[] = [];

    hiddenCols = ['employeeName', 'filerType'];

    recentGuidanceCount: number = 0;

    selectedGuidance?: Guidance;
    selectedEmployee?: Employee;

    reviewers: SelectItem[] = [];
    eventReviewers: SelectItem[] = [];

    public employee: Employee = new Employee();

    public get isAdmin(): boolean {
        return this.userService.isInRole(Roles.Admin);
    }

    public get canEdit(): boolean {
        return this.userService.user.upn.toLowerCase() == this.employee.upn.toLowerCase();
    }

    constructor(protected userService: CurrentUserService,
        protected route: ActivatedRoute,
        protected router: Router,
        protected extensionRequestService: ExtensionRequestService,
        protected formService: OGEForm450Service,
        protected settingsService: SettingsService,
        protected guidanceService: GuidanceService,
        protected eventService: EventRequestService,
        protected employeeListService: EmployeeListService,
        protected employeeService: EmployeeService,
        protected trainingService: TrainingService,
        protected positionService: OutsidePositionService,
        protected snackBar: MatSnackBar,
        private datePipe: DatePipe) {

    }

    canEditEmployees(): boolean {
        return this.userService.isInRole(Roles.Admin) || this.userService.isInRole(Roles.Support);
    }

    ngAfterViewInit(): void {

    }

    ngOnInit(): void {
        this.loadSettings();

        this.loadEmployee();
        this.loadForms();
        this.loadEvents();
        this.loadPositions();
        this.loadGuidance();
        this.loadTraining();
        this.loadReviewers();
        
    }

    loadReviewers() {
        this.employeeListService.getReviewers()
            .then(response => {
                this.reviewers.push({ text: 'Not Assigned', value: "na", group: "" });

                response.forEach(emp => {
                    let item: SelectItem = {
                        text: emp.displayName,
                        value: emp.upn,
                        group: ""
                    };

                    this.eventReviewers.push(item);
                })
            });
    }

    loadEventReviewers() {
        this.employeeListService.getEventReviewers()
            .then(response => {
                this.eventReviewers.push({ text: 'Not Assigned', value: "na", group: "" });

                response.forEach(emp => {
                    let item: SelectItem = {
                        text: emp.displayName,
                        value: emp.upn,
                        group: ""
                    };

                    this.eventReviewers.push(item);
                })
            });
    }

    public ethicsItems: EthicsItem[] = [];

    convertFormsToEthicsItems() {
        this.forms.forEach(form => {
            var item = new EthicsItem();
            var details = '';
            var dateToUse: Date;

            if (form.formStatus == FormStatus.CERTIFIED && form.dateOfReviewerSignature) {
                details = 'certified on ';
                dateToUse = new Date(form.dateOfReviewerSignature);
            }
            else if (form.dateOfEmployeeSignature) {
                details = 'submitted on ';
                dateToUse = new Date(form.dateOfEmployeeSignature);
            }
            else if (form.dueDate) {
                details = 'due on ';
                dateToUse = form.dueDate;
            }

            if (dateToUse) {
                item.details = details + this.datePipe.transform(dateToUse, 'MM/dd/yyyy');
                item.date = dateToUse;
            }

            item.title = form.year + ' ' + form.reportingStatus;
            item.status = form.formStatus;
            item.obj = form;
            item.type = EthicsItemTypes.OgeForm450;
            item.icon = 'feed';

            this.ethicsItems.push(item);
        });
    }

    convertGuidanceToEthicsItems() {
        this.guidance.forEach(g => {
            var item = new EthicsItem();

            item.title = g.summary;
            item.status = g.guidanceType;
            item.details = 'given on ' + this.datePipe.transform(g.dateOfGuidance, 'MM/dd/yyyy');
            item.obj = g;
            item.type = EthicsItemTypes.Guidance;
            item.icon = 'contact_support';
            item.date = new Date(g.dateOfGuidance);

            this.ethicsItems.push(item);
        });
    }

    convertEventsToEthicsItems() {
        this.eventRequests.forEach(e => {
            var item = new EthicsItem();

            item.title = e.eventName ? e.eventName : 'No Title';
            item.subtitle = 'attendee(s): ' + e.attendeesString;
            item.status = e.status;
            item.details = e.eventDates ? 'event dates ' + e.eventDates : 'no dates selected';
            item.obj = e;
            item.type = EthicsItemTypes.EventRequest;
            item.icon = 'event_available';
            item.date = e.eventStartDate ? new Date(e.eventStartDate) : new Date(2099, 12, 31);  // If no event start date, set it to way out in the future so it shows up on top.

            this.ethicsItems.push(item);
        });
    }

    convertTrainingsToEthicsItems() {
        this.ethicsItems = this.ethicsItems.filter(x => x.type != 'training');

        this.trainings.forEach(training => {
            var item = new EthicsItem();

            item.title = training.year + ' ' + training.trainingType;
            item.status = 'Completed';
            item.details = training.trainingDate != null ? 'completed on ' + this.datePipe.transform(training.trainingDate, 'MM/dd/yyyy') : '';
            item.obj = training;
            item.type = EthicsItemTypes.Training;
            item.icon = 'balance';
            item.date = new Date(training.trainingDate != null ? training.trainingDate : training.createdTime);

            this.ethicsItems.push(item);
        });
    }

    convertPositionsToEthicsItems() {
        this.positions.forEach(e => {
            var item = new EthicsItem();

            item.title = e.positionTitle ? e.positionTitle : 'No Position Title';
            item.status = e.status;
            item.details = e.positionDates ? 'position dates ' + e.positionDates : 'no dates selected';
            item.obj = e;
            item.type = EthicsItemTypes.OutsidePosition;
            item.icon = 'work';
            item.date = e.startDate ? new Date(e.startDate) : new Date(2099, 12, 31);  // If no event start date, set it to way out in the future so it shows up on top.

            this.ethicsItems.push(item);
        });
    }

    loadEvents() {
        let upn = this.employee.upn;
        this.eventRequests = [];
        this.eventService.getByEmployee(upn).then(response => {
            this.eventRequests = response;

            this.convertEventsToEthicsItems();
        });
    }

    loadPositions() {
        let upn = this.employee.upn;
        this.positions = [];
        this.positionService.getByEmployee(upn).then(response => {
            this.positions = response;

            this.convertPositionsToEthicsItems();
        });
    }
    
    loadTraining() {
        this.trainings = [];

        this.trainingService.getByUpn(this.employee.upn).then(response => {
            this.trainings = response;
            this.convertTrainingsToEthicsItems();
        });

        
    }

    loadGuidance() {
        let upn = this.employee.upn;
        this.guidance = [];
        this.guidanceService.getByEmployee(upn).then(response => {
            this.guidance = response;
            this.ethicsItems = this.ethicsItems.filter(x => x.type != EthicsItemTypes.Guidance);  // Remove all guidance so it doesn't repeat.
            this.convertGuidanceToEthicsItems();
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

    reloadForms(): void {
        this.loadForms();
    }

    setForms(forms: OgeForm450[]): void {
        this.forms = forms;
        this.convertFormsToEthicsItems();
    }

    public get canExtend(): boolean {
        var ret = (this.selectedForm?.formStatus == FormStatus.NOT_STARTED || this.selectedForm?.formStatus == FormStatus.DRAFT || this.selectedForm?.formStatus == FormStatus.MISSING_INFORMATION) && (this.selectedForm?.filer.toLowerCase() == this.userService.user.upn.toLowerCase() || this.userService.isInRole(Roles.Admin));
        return ret;
    }

    loadForms(): void {
        if (this.employee) {
            this.formService.getFormsByEmployee(this.employee.upn).then(forms => {
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

    addExtension(form: OgeForm450) {
        if (this.selectedForm)
            this.selectedForm = undefined;

        this.extensionRequestService.get(form.id).then(response => {
            this.selectedExtension = response;
            this.selectedExtension.form = form;
            this.drawer.open();
        });
    }

    saveExtension(extension: ExtensionRequest): void {
        this.extensionRequestService.save(extension).then(response => {
            this.snackBar.open("Extension Saved Successfully", "", {
                duration: 5000
            });
            this.drawer.close();
        });
    }

    drawerClosing(): void {
        this.selectedExtension = undefined;
        this.selectedGuidance = undefined;
        this.selectedForm = undefined;
        this.selectedEmployee = undefined;
        this.selectedEvent = undefined;
        this.selectedTraining = undefined;
        this.selectedPosition = undefined;
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

    itemSelected(item: EthicsItem) {
        switch (item.type) {
            case 'oge450':
                this.onFormSelect(item.obj);
                break;
            case 'guidance':
                this.onGuidanceSelect(item.obj);
                break;
            case 'event':
                this.onEventSelect(item.obj);
                break;
            case 'training':
                this.onTrainingSelect(item.obj);
                break;
            case 'position':
                this.onPositionSelect(item.obj);
                break;
        }
    }

    get getEthicItems(): EthicsItem[] {
        return this.ethicsItems.sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
    }

    onGuidanceSelect(guidance: Guidance): void {
        this.guidanceService.get(guidance.id).then(response => {
            this.showGuidance(response);
        });
    }

    onEventSelect(event: EventRequest): void {
        this.eventService.get(event.id).then(response => {
            if (this.canEdit && !response.status.includes('Closed')) {
                this.router.navigate(['/events/request/' + response.id])
            } else {
                this.showEvent(response);
            }
        });
    }

    onPositionSelect(position: OutsidePosition): void {
        this.positionService.get(position.id).then(response => {
            if (this.canEdit && this.canEditPosition(position)) {
                this.router.navigate(['/position/' + response.id])
            } else {
                this.showPosition(response);
            }
        });
    }

    canEditPosition(position: OutsidePosition): boolean {
        return position.status == OutsidePositionStatuses.DRAFT || position.status == OutsidePositionStatuses.AWAITING_MANAGER || position.status == OutsidePositionStatuses.DISAPPROVED;
    }

    onTrainingSelect(training: Training): void {
        this.selectedTraining = training;
        this.drawer.open();
    }

    showGuidance(guidance: Guidance): void {
        this.selectedGuidance = guidance;
        this.drawer.open();
    }

    showEvent(event: EventRequest): void {
        this.selectedEvent = event;
        this.drawer.open();
    }

    showPosition(position: OutsidePosition): void {
        this.selectedPosition = position;
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

    onFormSelect(form: OgeForm450): void {
        this.selectedForm = form;

        this.drawer.open();
    }

    viewForm(form: OgeForm450) {
        this.gotoDetail(form.id);
    }

    closeEvent(e: EventRequest) {
        this.ethicsItems = this.ethicsItems.filter(x => x.type != 'event');

        this.loadEvents();

        this.drawer.close();
    }

    newEvent(e: any) {
        this.router.navigate(['/events/request/0'])
    }

    newOutsidePosition(e: any) {
        this.router.navigate(['/position/0'])
    }

    closeTraining(training: Training) {
        if (training) {
            this.loadTraining();
        }
        this.drawer.close()
    }
}

export class EthicsItemTypes {
    public static EventRequest: string = "event";
    public static Training: string = "training";
    public static OgeForm450: string = "oge450";
    public static Guidance: string = "guidance";
    public static OutsidePosition: string = "position";
    
}
