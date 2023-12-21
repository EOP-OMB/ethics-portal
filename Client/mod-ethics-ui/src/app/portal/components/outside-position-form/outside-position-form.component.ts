import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OutsidePosition } from '@shared/models/outside-position.model';
import { OutsidePositionStatuses } from '@shared/static/outside-position-statuses.const';
import { OutsidePositionService } from '@shared/services/outside-position.service';
import { Lookups } from '@shared/static/lookups.static';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from '@shared/models/guid.static';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CurrentUserService } from 'mod-framework';
import { EmployeeService } from '@shared/services/employee.service';
import { Employee } from '@shared/models/employee.model';
import { environment } from '@src/environments/environment';
import { Attachment } from '@shared/models/attachment.model';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DownloadHelper } from '@shared/static/download.helper';
import { PositionAttachmentService } from '@shared/services/position-attachment.service';
import { Roles } from '@shared/static/roles.const';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var $: any;

@Component({
    selector: 'app-outside-position-form',
    templateUrl: './outside-position-form.component.html',
    styleUrls: ['./outside-position-form.component.scss']
})
export class OutsidePositionFormComponent implements OnInit {
    position: OutsidePosition;

    tempStartDate: Date;
    tempEndDate: Date;

    invalidControls: any[];
    invalidMessage: string;

    public workTypes = Lookups.WORK_TYPES;

    today: Date = new Date();
    positionStartDateMax: Date;
    positionEndDateMin: Date;

    attachments: FileInfo[];
    parentForeignKey: number = 0;

    public opForm: FormGroup;
    public newGuid: string;
    public isSubmitting: boolean = false;

    public showInstructions: boolean = false;

    get employeeName() { return this.opForm.get('employeeName'); }
    get employeeUpn() { return this.opForm.get('employeeUpn'); }
    get employeePhone() { return this.opForm.get('employeePhone'); }
    get employeeEmail() { return this.opForm.get('employeeEmail'); }
    get title() { return this.opForm.get('title'); }
    get grade() { return this.opForm.get('grade'); }
    get annualSalary() { return this.opForm.get('annualSalary'); }
    get filerType() { return this.opForm.get('filerType'); }
    get departmentName() { return this.opForm.get('departmentName'); }

    get poc() { return this.opForm.get('poc'); }
    get pocPhone() { return this.opForm.get('pocPhone'); }
    get pocEmail() { return this.opForm.get('pocEmail'); }
    get positionTitle() { return this.opForm.get('positionTitle'); }

    get organizationName() { return this.opForm.get('organizationName'); }
    get periodsOfEmployment() { return this.opForm.get('periodsOfEmployment'); }
    get physicalLocation() { return this.opForm.get('physicalLocation'); }
    get isPaid() { return this.opForm.get('isPaid'); }
    get methodOfCompensation() { return this.opForm.get('methodOfCompensation'); }
    get startDate() { return this.opForm.get('startDate'); }
    get endDate() { return this.opForm.get('endDate'); }
    get typeOfWork() { return this.opForm.get('typeOfWork'); }
    get duties() { return this.opForm.get('duties'); }
    get isLikeOfficialDuties() { return this.opForm.get('isLikeOfficialDuties'); }
    get relationshipToDuties() { return this.opForm.get('relationshipToDuties'); }
    get requiresAbsence() { return this.opForm.get('requiresAbsence'); }
    get involveExpense() { return this.opForm.get('involveExpense'); }
    get useOfFacilities() { return this.opForm.get('useOfFacilities'); }
    get requireDutiesContract() { return this.opForm.get('requireDutiesContract'); }
    get requiresDutiesFederal() { return this.opForm.get('requiresDutiesFederal'); }
    get involveOfficialTitle() { return this.opForm.get('involveOfficialTitle'); }
    get involveDutiesSales() { return this.opForm.get('involveDutiesSales'); }
    get involveOrg() { return this.opForm.get('involveOrg'); }
    get employeeSignature() { return this.opForm.get('employeeSignature'); }
    get submittedDate() { return this.opForm.get('submittedDate'); }
    get status() { return this.opForm.get('status'); }
    get supervisorName() { return this.opForm.get('supervisorName'); }
    get supervisorUpn() { return this.opForm.get('supervisorUpn'); }
    get guidance() { return this.opForm.get('guidance'); }
    get additionalRemarks() { return this.opForm.get('additionalRemarks'); }
    get supervisor() { return this.opForm.get('supervisor'); }
    get managerNa() { return this.opForm.get('managerNa'); }

    public errorMessage(name: string): string {
        var msg = "";

        switch (name) {
            case "employeeName":
                msg = "Employee Name is required.";
                break;
            case "supervisorName":
                msg = "Supervisor is required.";
                break;
            case "employeePhone":
                msg = "Phone Number is required.";
                break;
            case "employeeEmail":
                msg = "Employee Email is required.";
                break;
            case "departmentName":
                msg = "Office is required.";
                break;
            case "title":
                msg = "OMB Position Title is required.";
                break;
            case "annualSalary":
                msg = "Annual Salary is required.";
                break;
            case "filerType":
                msg = "Filer Type is required.";
                break;
            case "poc":
                msg = "Position POC is required.";
                break;
            case "pocPhone":
                msg = "Position POC Phone is required.";
                break;
            case "pocEmail":
                msg = "Position POC Email is required.";
                break;
            case "positionTitle":
                msg = "Position Title is required.";
                break;
            case "organizationName":
                msg = "Organization Name is required.";
                break;
            case "periodsOfEmployment":
                msg = "Periods of Employment is required.";
                break;
            case "physicalLocation":
                msg = "Physical Location of Duties is required.";
                break;
            case "isPaid":
                msg = "Compensation is required.";
                break;
            case "methodOfCompensation":
                msg = "Method of Compensation is required.";
                break;
            case "startDate":
                msg = "Start Date is invalid.";
                break;
            case "endDate":
                msg = "End Date is invalid.";
                break;
            case "duties":
                msg = "Duties or Services is required.";
                break;
            case "isLikeOfficialDuties":
                msg = "Related to Official Duties is required.";
                break;
            case "relationshipToDuties":
                msg = "Describe Relationship is required.";
                break;
            case "requiresAbsence":
                msg = "Requiree Absence is required.";
                break;
            case "involveExpense":
                msg = "Involve Expenses is required.";
                break;
            case "useOfFacilities":
                msg = "Involve Use of Facilities is required.";
                break;
            case "requireDutiesContract":
                msg = "Require Work for Federal Contractor or Grantee.";
                break;
            case "requiresDutiesFederal":
                msg = "Require Government Facilities is required.";
                break;
            case "involveOfficialTitle":
                msg = "Involve Official Title or Representation is required.";
                break;
            case "involveDutiesSales":
                msg = "Sales Agent is required.";
                break;
            case "involveOrg":
                msg = "Involve EOP Business Partner is required.";
                break;
            case "typeOfWork":
                msg = "Nature of Outside Position is required.";
                break;
            default:
                msg = name + " is missing.";
                break;
        }

        return msg;
    }

    uploadSaveUrl = "saveUrl"; // should represent an actual API endpoint
    uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint

    constructor(private route: ActivatedRoute,
        private positionService: OutsidePositionService,
        private router: Router,
        private formBuilder: FormBuilder,
        private userService: CurrentUserService,
        private employeeService: EmployeeService,
        protected snackBar: MatSnackBar,
        private attachmentService: PositionAttachmentService) {

        this.uploadSaveUrl = environment.apiUrl + "/api/positionAttachment/upload";
        this.uploadRemoveUrl = environment.apiUrl + "/api/positionAttachment/remove";

        this.opForm = this.formBuilder.group({
            id: [0],
            employeeName: ['', [Validators.required]],
            employeeUpn: ['', [Validators.required]],
            employeePhone: [null, [Validators.required]],
            employeeEmail: ['', [Validators.required]],
            title: ['', [Validators.required]],
            annualSalary: [null, [Validators.required]],
            filerType: ['', [Validators.required]],
            departmentName: [null, [Validators.required]],
            poc: ['', [Validators.required]],
            pocPhone: [null, [Validators.required]],
            pocEmail: ['', [Validators.required]],
            positionTitle: ['', [Validators.required]],
            organizationName: ['', [Validators.required]],
            periodsOfEmployment: ['', [Validators.required]],
            physicalLocation: ['', [Validators.required]],
            isPaid: [null, [Validators.required]],
            methodOfCompensation: ['', [Validators.required]],
            startDate: [null, [Validators.required]],
            endDate: [null],
            typeOfWork: [0, [Validators.min(1)]],
            duties: ['', [Validators.min(1)]],
            isLikeOfficialDuties: [null, [Validators.required]],
            relationshipToDuties: [''],
            requiresAbsence: [null, [Validators.required]],
            involveExpense: [null, [Validators.required]],
            useOfFacilities: [null, [Validators.required]],
            requireDutiesContract: [null, [Validators.required]],
            requiresDutiesFederal: [null, [Validators.required]],
            involveOfficialTitle: [null, [Validators.required]],
            involveDutiesSales: [null, [Validators.required]],
            involveOrg: [null, [Validators.required]],
            employeeSignature: [''],
            submittedDate: [null],
            status: [''],
            supervisorName: [''],
            supervisorUpn: [''],
            guidance: [''],
            additionalRemarks: [''],
            supervisor: [{ value: null, disabled: false }, [Validators.required]],
            managerNa: [false]
        });

        this.newGuid = Guid.newGuid();
    }

    ngOnInit() {
        this.route.data.subscribe((data: { position: OutsidePosition }) => {

            this.initialize(data.position);

            if (!this.canView()) {
                this.goBack(true);
            }

            if (!this.position.outsidePositionAttachments) {
                this.position.outsidePositionAttachments = [];
            } else {
                this.initializeAttachments();
            }

            localStorage.setItem('dirtyOvervide', "0");
        });

        this.managerNa.valueChanges.subscribe(managerNa => {
            if (managerNa) {
                this.supervisor.clearValidators();
                this.supervisor.updateValueAndValidity();
                this.supervisorName.clearValidators();
                this.supervisorName.updateValueAndValidity();
                this.supervisorUpn.clearValidators();
                this.supervisorUpn.updateValueAndValidity();
                this.supervisor.disable();
                this.supervisorName.setValue(null);
                this.supervisorUpn.setValue(null);
            }
            else {
                this.supervisor.setValidators(Validators.required);
                this.supervisorName.setValidators(Validators.required);
                this.supervisorUpn.setValidators(Validators.required);
                if (this.canSave())
                    this.supervisor.enable();
            }
        });

        this.isLikeOfficialDuties.valueChanges.subscribe(isLikeOfficialDuties => {
            if (!isLikeOfficialDuties) {
                this.relationshipToDuties.clearValidators();
                this.relationshipToDuties.updateValueAndValidity();
            }
            else {
                this.relationshipToDuties.setValidators(Validators.required);
            }
        });
    }

    ngAfterViewInit() {
        if (!this.position.status || this.position.status == '')
            this.showModal('intro-popup');
    }

    initializeAttachments() {
        this.attachments = [];

        this.position.outsidePositionAttachments.forEach(attachment => {
            this.attachments.push(this.mapToFileInfo(attachment));
        });
    }

    initialize(position: OutsidePosition) {
        this.position = position;
        this.employeeService.getMyProfile().then(response => {

            if (position.id == 0) {
                this.position.employeeName = response.displayName;
                this.position.supervisorName = response.reportsTo?.displayName;
                this.position.supervisorUpn = response.reportsTo?.upn;
                this.position.employeePhone = Number(response.officePhone) > 0 ? Number(response.officePhone) : (Number(response.mobilePhone) > 0 ? Number(response.mobilePhone) : null);
                this.position.employeeEmail = response.emailAddress;
                this.position.departmentName = response.departmentName;
                this.position.title = response.title;
                this.position.annualSalary = response.annualSalary;
                this.position.filerType = response.filerType;
                this.position.employeeUpn = response.upn;
                this.position.supervisor = response.reportsTo;

                this.position.attachmentGuid = this.newGuid;

                this.opForm.patchValue(this.position);
            }
            else {
                console.log(this.position);
                this.opForm.patchValue(this.position);
                this.supervisor.setValue(this.position.supervisor);
            }

            if (this.position.supervisor == null)
                this.managerNa.setValue(true);

            this.parentForeignKey = this.position.id;

            this.disableControls(response);

            if (!this.canSave())
                this.disableForm();
            else
                this.opForm.markAsPristine();
        });
    }

    disableControls(emp: Employee) {
        if (emp.upn.toLowerCase() == this.position.employeeUpn.toLowerCase()) {
            if (this.position.employeeName && this.position.employeeName == emp.displayName)
                this.employeeName.disable();

            if (this.position.employeePhone && (this.position.employeePhone == Number(emp.officePhone) || this.position.employeePhone == Number(emp.mobilePhone)))
                this.employeePhone.disable();

            if (this.position.employeeEmail && this.position.employeeEmail == emp.emailAddress)
                this.employeeEmail.disable();

            if (this.position.departmentName && this.position.departmentName == emp.departmentName)
                this.departmentName.disable();

            if (this.position.title && this.position.title == emp.title)
                this.title.disable();

            // Never disable annualSalary, allow employees to use a  diff value than what is from DCPDS
            //if (this.position.annualSalary && this.position.annualSalary == emp.annualSalary)
            //    this.annualSalary.disable();

            if (this.position.filerType && this.position.filerType == emp.filerType)
                this.filerType.disable();
        }
        else {
            // Viewing someone elses form, disable employee edits

            this.employeeName.disable();
            this.employeePhone.disable();
            this.employeeEmail.disable();
            this.departmentName.disable();
            this.title.disable();
            this.filerType.disable();
        }
    }

    saveAndClose() {
        this.save(false, true);
    }

    submitPosition(position: OutsidePosition) {
        this.opForm.markAllAsTouched();

        if (this.opForm.valid && this.canSubmit()) {
            this.positionService.submit(position).then(response => {
                this.saveComplete(true, response);
            });
            this.disableForm();
        } else {
            this.scrollToFirstInvalidControl();
            this.findInvalidControls();
            this.isSubmitting = true;
        }
    }

    public findInvalidControls() {
        this.invalidControls = [];
        const controls = this.opForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                this.invalidControls.push(name);
            }
        }
        return this.invalidControls;
    }

    private scrollToFirstInvalidControl() {
        const firstElementWithError: HTMLElement = document.querySelector('#employmentFormContainer');

        if (firstElementWithError) {
            firstElementWithError.scrollIntoView({ behavior: 'smooth' });
        }
    }

    disableForm(): void {
        this.opForm.disable();
        this.guidance.enable();
    }

    save(submitting: boolean, close: boolean = false): void {
        this.position = Object.assign(this.position, this.opForm.getRawValue());
        var oldId = this.position.id;
        
        if (this.canSave() || submitting) {
            this.positionService.save(this.position)
                .then(response => {
                    this.initialize(response);
                    if (submitting)
                        this.submitPosition(response);
                    else 
                        this.saveComplete(close, response);
                });
        }
    }

    saveComplete(close: boolean, position: OutsidePosition): void {
        if (close) {
            this.confirmClose();
        }
        else {
            this.initialize(position);

            this.snackBar.open("Outside Position Saved Successfully", "", {
                duration: 5000
            });
        }
    }

    canSubmit(): boolean {
        // can submit if: It is a Draft or Disapproved
        return (
                (this.position.id == 0 || this.position.status == OutsidePositionStatuses.DRAFT || this.position.status == OutsidePositionStatuses.DISAPPROVED) &&
                (this.position.employeeUpn?.toLowerCase() == this.userService.user?.upn.toLowerCase())
            );
    }

    isEthicsApprover(): boolean {
        return this.userService.isInRole(Roles.Admin) ||
            this.userService.isInRole(Roles.Reviewer);
    }

    canView(): boolean {
        return this.position.id == 0 || this.isEthicsApprover() || this.userService.isInRole(Roles.Support) || this.position.supervisorUpn?.toLowerCase() == this.userService.user?.upn.toLowerCase() ||
            this.position.employeeUpn?.toLowerCase() == this.userService.user?.upn.toLowerCase();
    }

    canSave(): boolean {
        if (!this.position)
            return false;

        // can save if:
        // It is the logged in user's form AND
        //     It is a Draft or Disapproved or Awwaiting Manager
        // Or
        // Manager (or Ethics) can make edits when AWAITING_MANAGER
        // Or
        // Ethics can make edits when AWAITING_ETHICS
        return (
            (
                (
                    this.position.id == 0 ||
                    this.position.status == OutsidePositionStatuses.DRAFT ||
                    this.position.status == OutsidePositionStatuses.DISAPPROVED ||
                    this.position.status == OutsidePositionStatuses.AWAITING_MANAGER
                ) &&
                this.position.employeeUpn?.toLowerCase() == this.userService.user?.upn.toLowerCase()
            ) ||
            (
                this.position.status == OutsidePositionStatuses.AWAITING_MANAGER &&
                (this.position.supervisorUpn?.toLowerCase() == this.userService.user?.upn.toLowerCase() ||
                this.isEthicsApprover())
            ) ||
            (
                this.position.status == OutsidePositionStatuses.AWAITING_ETHICS && this.isEthicsApprover()
            )
        );
    }

    canApprove(): boolean {
        return this.canApproveManager() || this.canApproveEthics();
    }

    canApproveManager(): boolean {
        // Can approve
        // if Admin or Reviewer AND it's Awaiting Ethics UNLESS it's our form or we're in debug mode
        // OR
        // if Admin or Reviewer or Supervisor AND we're awaiting Manager UNLESS it's our form or we're in debug mode
        return ((this.isEthicsApprover() || this.position.supervisorUpn?.toLowerCase() == this.userService.user.upn.toLowerCase()) && this.position.status == OutsidePositionStatuses.AWAITING_MANAGER) &&
            (this.position.employeeUpn.toLowerCase() != this.userService.user.upn.toLowerCase() || environment.debug);
    }

    canApproveEthics(): boolean {
        // Can approve
        // if Admin or Reviewer AND it's Awaiting Ethics UNLESS it's our form or we're in debug mode
        // OR
        // if Admin or Reviewer or Supervisor AND we're awaiting Manager UNLESS it's our form or we're in debug mode
        return (this.isEthicsApprover() && this.position.status == OutsidePositionStatuses.AWAITING_ETHICS) &&
            (this.position.employeeUpn.toLowerCase() != this.userService.user.upn.toLowerCase() || environment.debug);
    }

    canDelete(): boolean {
        // delete logic is the same as submit logic
        return this.canSubmit();
    }

    isDirty(): boolean {
        return this.opForm.dirty;
    }

    goBack(override: boolean = false): void {
        localStorage.setItem('goto', localStorage.getItem('prev') ? localStorage.getItem('prev') : '/home');

        if (this.canSave() && this.isDirty() && !override)
            $('#confirm-close').modal();
        else
            this.confirmClose();
    }

    confirmClose() {
        localStorage.setItem('dirtyOvervide', "1");
        $('#confirm-close').modal('hide');

        // Check to see if we were trying to go somewhere other than previous, if not go back to previous
        var goto = localStorage.getItem('goto') ? localStorage.getItem('goto') : '';
        
        if (goto == '') {
            goto = localStorage.getItem('prev') ? localStorage.getItem('prev') : '/home';
        }

        if (goto.includes('position/'))
            goto = '/';

        this.router.navigate([goto]);
    }

    approve(): void {
        this.position = Object.assign(this.position, this.opForm.getRawValue());
        
        this.positionService.save(this.position).then(() => {
            this.positionService.approve(this.position).then(() => {
                this.goBack(true);
            });
        });
    }

    deny(): void {
        this.position = Object.assign(this.position, this.opForm.getRawValue());
        this.positionService.save(this.position).then(() => {
            this.position.disapproveReason = this.position.guidance;
            this.positionService.disapprove(this.position).then(() => {
                this.goBack(true);
            });
        });
    }

    canCancel(): boolean {
        return this.isEthicsApprover() && this.position.status != OutsidePositionStatuses.CANCELED;
    }

    cancelRequest(): void {
        if (confirm("You are about to cancel this Outside Position request, to proceed, click OK. If you do not wish to cancel this request, click Cancel.")) {
            this.positionService.cancelRequest(this.position).then(() => {
                this.goBack(true);
            });
        }
    }

    delete(): void {
        if (confirm("You are about to delete this Outside Position Form, to proceed, click OK. If you do not wish to delete the form, click Cancel.")) {
            this.positionService.delete(this.position.id).then(() => {
                this.goBack(true);
            });
        }
    }

    isTypeOfWork(value: number) {
        var typeOfWork = Number(this.typeOfWork.value);
        return (typeOfWork & value) == value;
    }

    updateTypeOfWork(e: MatCheckboxChange): void {
        var value = Number(this.typeOfWork.value);

        if (e.checked) {
            value += Number(e.source.value);
        }
        else {
            value -= Number(e.source.value);
        }

        this.typeOfWork.setValue(value);
    }

    public setPositionDateStart(e) {
        if (!isNaN(e)) {
            this.positionEndDateMin = e;
        }
    }

    public setPositionDateEnd(e) {
        this.positionStartDateMax = e;
    }

     public showReviewSecion(): boolean {
         return (this.position.supervisorUpn?.toLowerCase() == this.userService.user.upn.toLowerCase() || this.userService.isInRole(Roles.Admin) || this.userService.isInRole(Roles.Reviewer)) &&
            this.position.status != OutsidePositionStatuses.DRAFT;
    }

    print(): void {
        window.print();
    }

    clearSupervisor(): void {
        this.supervisor.setValue(null);
    }

    supervisorSelect(employee: Employee) {
        this.supervisorName.setValue(employee.displayName);
        this.supervisorUpn.setValue(employee.upn);
    }

    downloadFile(info: FileInfo) {
        DownloadHelper.downloadFile(info, this.attachmentService);
    }

    mapToFileInfo(att: Attachment): FileInfo {
        var fi: FileInfo = {
            name: att.name,
            rawFile: att.content,
            size: att.size,
            uid: att.uid

        };

        return fi;
    }

    getBitValue(values: string[]): number {
        var value = 0;

        values.forEach(s => {
            var intValue = +s;
            value += intValue;
        });

        return value;
    }

    showModal(id: string): void {
        this.toggleModal(id, 'show');
    }

    toggleModal(id: string, action: "show" | "hide"): void {
        $('#' + id).modal(action);
    }

    // status table:
    displayedColumns: string[] = ['createdTime', 'createdByName', 'action', 'comment', 'status'];
}

//export class PreventUnsavedChangesGuard implements CanDeactivate<OutsidePositionComponent> {
//    canDeactivate(component: OutsidePositionComponent) {
//        var override = localStorage.getItem('dirtyOvervide') ? localStorage.getItem('dirtyOvervide') == "1" : false;

//        if (component.canSave() && !override && component.isDirty()) {
//            $('#confirm-close').modal();
//            return false;
//        }

//        return true;
//    }
//}
