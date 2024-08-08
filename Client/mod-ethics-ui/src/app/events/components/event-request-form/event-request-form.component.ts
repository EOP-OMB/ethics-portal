import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserService, UserInfo } from 'mod-framework';
import { FileItem } from 'ng2-file-upload';

import { Attachment } from '@shared/models/attachment.model';
import { Attendee } from '@shared/models/attendee.model';
import { Employee } from '@shared/models/employee.model';
import { EventRequest } from '@shared/models/event-request.model';
import { Guid } from '@shared/models/guid.static';
import { EventRequestService } from '@shared/services/event-request.service';
import { AttachmentType } from '@shared/static/attachment-type.const';
import { EventStatus } from '@shared/static/event-status.const';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateInputCustomFormatPlaceholder } from '@progress/kendo-angular-dateinputs';
import { environment } from '@src/environments/environment';
import { FileInfo, FileRestrictions } from '@progress/kendo-angular-upload';
import { DownloadHelper } from '@shared/static/download.helper';
import { EventAttachmentService } from '@shared/services/event-attachment.service';
import { PhonePipe } from '@shared/phone.pipe';
import { EmployeeService } from '@shared/services/employee.service';
import { HttpResponse } from '@angular/common/http';
import { EthicsFormService } from '@portal/services/ethics-form.service';

function requiredIfValidator(predicate) {
    return (formControl => {
        if (!formControl.parent) {
            return null;
        }
        if (predicate()) {
            return Validators.required(formControl);
        }
        return null;
    })
}

@Component({
    selector: 'app-event-request-form',
    templateUrl: './event-request-form.component.html',
    styleUrls: ['./event-request-form.component.scss']
})
export class EventRequestFormComponent implements OnInit {
    @Input()
    request: EventRequest;

    origEvent: EventRequest;

    @ViewChild('uplTravelForm') uplTravelForm;
    @ViewChild('uplInvitation') uplInvitation;
    @ViewChild('uplOther') uplOther;

    today: Date = new Date();
    eventStartDateMax: Date;
    eventEndDateMin: Date;

    public formatPlaceholder: DateInputCustomFormatPlaceholder = {
        day: "D",
        month: "M",
        year: "YYYY",
        hour: "H",
        minute: "MM",
        second: "SS",
    };

    parentForeignKey: number = 0;

    uploadSaveUrl = "saveUrl"; // should represent an actual API endpoint
    uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint

    outsideSourceTravelForms: FileInfo[] = [];
    invitations: FileInfo[] = [];

    restrictions: FileRestrictions = {
        allowedExtensions: [".xls", ".xlsx", ".doc", ".docx", ".jpg", ".pdf", ".png", ".csv"],
        maxFileSize: 1073741824
    };

    public eventRequestForm: FormGroup;

    public errorMessage(name: string): string {
        var msg = "";

        switch (name) {
            case "eventRequestAttendees":
                msg = "At least one attendee is required, ensure all required fields for the attendee are answered, see below for details.";
                break;
            case "eventName":
                msg = "Event Name is requried.";
                break;
            case "eventStartDate":
                msg = "Event Start Date is invalid.";
                break;
            case "eventEndDate":
                msg = "Event End Date is invalid.";
                break;
            case "eventLocation":
                msg = "Location is requried.";
                break;
            case "approximateAttendees":
                msg = "Approximate # of Attendees is requried.";
                break;
            case "crowdDescription":
                msg = "Crowd Description is requried.";
                break;
            case "isFundraiser":
                msg = "Is this a fund-raising event is requried.";
                break;
            case "isOpenToMedia":
                msg = "Will the event be open to the press is required.";
                break;
            case "isQAndA":
                msg = "Will there be Q&A is required.";
                break;
            case "requiresTravel":
                msg = "Will you travel outside the D.C. metro area for this event is required.";
                break;
            case "internationalTravel":
                msg = "International Travel is required.";
                break;
            case "fairMarketValue":
                msg = "Fair Market Value is required.";
                break;
            case "whoIsPaying":
                msg = "Who is Paying is required.";
                break;
            case "guestsInvited":
                msg = "Spouse or Guest Invited is required.";
                break;
            case "receivedInvitation":
                msg = "Received Invitiation is required.";
                break;
            case "individualExtendingInvite":
                msg = "Individual Extending Invite is required.";
                break;
            case "isIndividualLobbyist":
                msg = "Individual Extending Invite - Registered Lobbyist is required.";
                break;
            case "orgExtendingInvite":
                msg = "Organization Extending Invite is required.";
                break;
            case "isOrgLobbyist":
                msg = "Organization Extending Invite - Registered Lobbyist is required.";
                break;
            case "orgTypes":
                msg = "Type of Organization is required.";
                break;
            case "orgHostingEvent":
                msg = "Individual Organization Sponsoring Event is required.";
                break;
            case "isHostLobbyist":
                msg = "Individual Organization Sponsoring Event - Registered Lobbyist is required.";
                break;
            case "hostOrgTypes":
                msg = "Sponsor Type of Organization is required.";
                break;
            case "eventContactName":
                msg = "Event Contact Name is required.";
                break;
            case "eventContactPhone":
                msg = "Event Contact Phone is required.";
                break;
            case "eventContactEmail":
                msg = "Event Contact Email is required.";
                break;
            case "contactComponent":
                msg = "Component is required.";
                break;
        }

        return msg;
    }

    get eventRequestAttendees(): FormArray { return this.eventRequestForm.get('eventRequestAttendees') as FormArray; }

    get eventName() { return this.eventRequestForm.get('eventName'); }
    get eventStartDate() { return this.eventRequestForm.get('eventStartDate'); }
    get eventEndDate() { return this.eventRequestForm.get('eventEndDate'); }
    get eventLocation() { return this.eventRequestForm.get('eventLocation'); }
    get approximateAttendees() { return this.eventRequestForm.get('approximateAttendees'); }
    get crowdDescription() { return this.eventRequestForm.get('crowdDescription'); }
    get isFundraiser() { return this.eventRequestForm.get('isFundraiser'); }
    get isOpenToMedia() { return this.eventRequestForm.get('isOpenToMedia'); }
    get isQAndA() { return this.eventRequestForm.get('isQAndA'); }

    get requiresTravel() { return this.eventRequestForm.get('requiresTravel'); }
    get internationalTravel() { return this.eventRequestForm.get('internationalTravel'); }
    get fairMarketValue() { return this.eventRequestForm.get('fairMarketValue'); }
    get whoIsPaying() { return this.eventRequestForm.get('whoIsPaying'); }
    get guestsInvited() { return this.eventRequestForm.get('guestsInvited'); }
    get individualExtendingInvite() { return this.eventRequestForm.get('individualExtendingInvite'); }
    get isIndividualLobbyist() { return this.eventRequestForm.get('isIndividualLobbyist'); }
    get orgExtendingInvite() { return this.eventRequestForm.get('orgExtendingInvite'); }
    get isOrgLobbyist() { return this.eventRequestForm.get('isOrgLobbyist'); }
    get orgTypes() { return this.eventRequestForm.get('orgTypes'); }
    get orgOther() { return this.eventRequestForm.get('orgOther'); }
    get orgHostingEvent() { return this.eventRequestForm.get('orgHostingEvent'); }
    get isHostLobbyist() { return this.eventRequestForm.get('isHostLobbyist'); }
    get hostOrgTypes() { return this.eventRequestForm.get('hostOrgTypes'); }
    get hostOther() { return this.eventRequestForm.get('hostOther'); }
    get eventContactName() { return this.eventRequestForm.get('eventContactName'); }
    get eventContactPhone() { return this.eventRequestForm.get('eventContactPhone'); }
    get eventContactEmail() { return this.eventRequestForm.get('eventContactEmail'); }
    get contactEmail() { return this.eventRequestForm.get('contactEmail'); }
    get contactNumber() { return this.eventRequestForm.get('contactNumber'); }
    get contactComponent() { return this.eventRequestForm.get('contactComponent'); }
    get moderatorsAndPanelists() { return this.eventRequestForm.get('moderatorsAndPanelists'); }
    get receivedInvitation() { return this.eventRequestForm.get('receivedInvitation'); }

    newGuid: string;

    constructor(private formBuilder: FormBuilder,
        private eventService: EventRequestService,
        private userService: CurrentUserService,
        private attachmentService: EventAttachmentService,
        private employeeService: EmployeeService,
        private ethicsFormService: EthicsFormService,
        private router: Router,
        private phonePipe: PhonePipe) {

        this.uploadSaveUrl = environment.apiUrl + "/api/eventAttachment/upload";
        this.uploadRemoveUrl = environment.apiUrl + "/api/eventAttachment/remove";

        this.today.setHours(0, 0, 0, 0);
        
        this.eventRequestForm = this.formBuilder.group({
            id: [0],
            eventRequestAttendees: this.formBuilder.array([], [this.formIsEmpty]),
            eventName: ['', [Validators.required]],
            eventStartDate: [null, [Validators.required]],
            eventEndDate: [null, [Validators.required]],
            eventLocation: ['', [Validators.required]],
            approximateAttendees: [null, [Validators.required]],
            crowdDescription: ['', [Validators.required]],
            isFundraiser: [null, [Validators.required]],
            isOpenToMedia: [null, [Validators.required]],
            isQAndA: [null, [Validators.required]],
            moderatorsAndPanelists: [''],
            requiresTravel: [null, [Validators.required]],
            internationalTravel: [null, [Validators.required]],
            fairMarketValue: [null, [Validators.required]],
            whatIsProvided: [null],
            whoIsPaying: ['', [Validators.required]],
            guestsInvited: [null, [Validators.required]],
            receivedInvitation: [null, [Validators.required]],
            individualExtendingInvite: ['', [Validators.required]],
            isIndividualLobbyist: [null, [Validators.required]],
            orgExtendingInvite: ['', [Validators.required]],
            isOrgLobbyist: [null, [Validators.required]],
            orgTypes: [0, [, requiredIfValidator(() => !this.orgOther.value)]],
            orgOther: [''],
            orgHostingEvent: ['', [Validators.required]],
            isHostLobbyist: [null, [Validators.required]],
            hostOrgTypes: [0, [requiredIfValidator(() => !this.hostOther.value)]],
            hostOther: [''],
            eventContactName: ['', [Validators.required]],
            eventContactPhone: ['', [Validators.required]],
            eventContactEmail: ['', [Validators.required]],
            contactEmail: ['', [Validators.required]],
            contactNumber: ['', [Validators.required]],
            contactComponent: ['', [Validators.required]],
            additionalInformation: [''],
        });

        this.newGuid = Guid.newGuid();

        this.hostOther.valueChanges
            .subscribe(value => {
                this.hostOrgTypes.updateValueAndValidity();
            });

        this.orgOther.valueChanges
            .subscribe(value => {
                this.orgTypes.updateValueAndValidity();
            });
    }

    getForm(id: number) {
        this.ethicsFormService.getFile(id).subscribe(async (event) => {
            let data = event as HttpResponse<Blob>;
            const downloadedFile = new Blob([data.body as BlobPart], {
                type: data.body?.type
            });

            if (downloadedFile.type != "") {
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                a.download = "TRAVELFORM 4.2019.doc";
                a.href = URL.createObjectURL(downloadedFile);
                a.target = '_blank';
                a.click();
                document.body.removeChild(a);
            }
        });
    }

    private formIsEmpty(control: FormArray) {
        if (control.controls.length === 0) {
            return { noValue: true }
        }
        return null;
    }

    public setEventDateStart(e) {
        if (!isNaN(e)) {
            this.eventEndDateMin = e;
            this.eventEndDate.setValue(e);
        }
    }

    public setEventDateEnd(e) {
        this.eventStartDateMax = e;
    }

    public isDirty(): boolean {
        return this.eventRequestForm.dirty;
    }

    get user() {
        return this.userService.user;
    }

    ngOnInit(): void {
        this.isQAndA.valueChanges.subscribe(isQA => {
            if (!isQA) {
                this.moderatorsAndPanelists.clearValidators();
            }
            else {
                this.moderatorsAndPanelists.setValidators(Validators.required);
            }
        })

        this.initialize(this.request);
    }

    ngAfterViewInit() {
        if (!this.request.status || this.request.status == '')
            this.showModal('intro-popup');
    }

    initialize(eventRequest: EventRequest) {
        this.request = eventRequest;

        if (this.request.id == 0) {
            this.employeeService.getMyProfile().then(response => {

                this.request.attachmentGuid = this.newGuid;

                this.request.contactEmail = response.emailAddress;
                this.request.contactNumber = response.officePhone ? response.officePhone : response.mobilePhone;
                this.request.contactComponent = response.departmentName;

                this.initializeEvent();
            });
        }
        else {
            this.initializeEvent();
        }
    }

    initializeEvent() {
        this.parentForeignKey = this.request.id;

        if (!this.request.eventRequestAttendees || this.request.eventRequestAttendees.length == 0) {
            this.request.eventRequestAttendees = [];
            this.newAttendee();
        }
        else {
            this.initializeAttendees(this.request.eventRequestAttendees);
        }

        if (!this.request.eventRequestAttachments) {
            this.request.eventRequestAttachments = [];
        } else {
            this.initializeAttachments();
        }

        this.setOrgTypes();

        this.eventRequestForm.patchValue(this.request);
        this.eventRequestForm.patchValue({ contactNumber: this.phonePipe.transform(this.request.contactNumber) });
        this.eventRequestForm.patchValue({ eventContactPhone: this.phonePipe.transform(this.request.eventContactPhone) });
        this.eventRequestForm.markAsPristine();
    }

    downloadFile(info: FileInfo) {
        DownloadHelper.downloadFile(info, this.attachmentService);
    }

    setOrgTypes() {
        var selectedTypes: string[] = [];

        this.checkValue(this.request.typeOfOrg, 1, selectedTypes);
        this.checkValue(this.request.typeOfOrg, 2, selectedTypes);
        this.checkValue(this.request.typeOfOrg, 4, selectedTypes);
        this.checkValue(this.request.typeOfOrg, 8, selectedTypes);
        this.checkValue(this.request.typeOfOrg, 16, selectedTypes);
                        
        this.orgTypes.patchValue(selectedTypes);

        selectedTypes = [];

        this.checkValue(this.request.typeOfHost, 1, selectedTypes);
        this.checkValue(this.request.typeOfHost, 2, selectedTypes);
        this.checkValue(this.request.typeOfHost, 4, selectedTypes);
        this.checkValue(this.request.typeOfHost, 8, selectedTypes);
        this.checkValue(this.request.typeOfHost, 16, selectedTypes);

        this.hostOrgTypes.patchValue(selectedTypes);
    }                   
                        
    checkValue(checkValue: number, value: number, selectedTypes: string[]) {
        if ((checkValue & value) == value)
            selectedTypes.push(value.toString());
    }

    initializeAttachments() {
        this.invitations = this.getFiles(AttachmentType.INVIATIONS);
        this.outsideSourceTravelForms = this.getFiles(AttachmentType.TRAVEL_FORMS);
    }

    amIGoing(): boolean {
        return this.request.eventRequestAttendees ? this.request.eventRequestAttendees.find(x => x.employee && x.employee.upn == this.user.upn) != undefined : false;
    }

    canSubmit(): boolean {
        return this.request.status == EventStatus.DRAFT || this.request.id == 0;
    }

    canDelete(): boolean {
        // delete logic is the same as submit logic
        return this.request.status == EventStatus.DRAFT;
    }

    delete(): void {
        if (confirm("You are about to delete this Event Request, to proceed, click OK. If you do not wish to delete the request, click Cancel.")) {
            this.eventService.delete(this.request.id);
            this.goBack();
        }
    }

    canSave(): boolean {
        return this.request ? (this.request.status ? !this.request.status.includes('Closed') : true) : true;
    }

    newAttendee(): void {
        this.eventRequestForm.markAsDirty();
        this.eventRequestAttendees.push(this.createNewAttendee(new Attendee(this.request.id)));       
    }

    initializeAttendees(attendees: Attendee[]) {
        this.eventRequestAttendees.clear();

        attendees.forEach(att => {
            this.eventRequestAttendees.push(this.createNewAttendee(att));
        });
    }

    private createNewAttendee(att: Attendee): FormGroup {
        console.log(att);

        const formGroup = this.formBuilder.group({
            id: [att.id],
            employee: [att.employee, Validators.required],
            nameOfSupervisor: [att.nameOfSupervisor ?? null, Validators.required],
            informedSupervisor: [att.informedSupervisor ?? null, Validators.required],
            employeeType: [att.employeeType ?? null, Validators.required],
            capacity: [att.capacity ?? null, Validators.required],
            isGivingRemarks: [att.isGivingRemarks ?? null, Validators.required],
            remarks: [att.remarks ?? null],
            reasonForAttending: [att.reasonForAttending ?? null, Validators.required],
            isSpeakerAgreementRequired: [att.isSpeakerAgreementRequired ?? null],
            attachmentGuid: [att.attachmentGuid],
            attendeeAttachments: [att.attendeeAttachments]
        });

        return formGroup;
    }

    goBack(): void {
        if (this.canSave() && this.isDirty())
            $('#confirm-close').modal();
        else
            this.confirmClose();
    }

    deleteAttendee(index: number): void {
        this.eventRequestAttendees.markAsDirty();
        this.eventRequestAttendees.removeAt(index);

        if (this.eventRequestAttendees.length == 0) {
            this.newAttendee();
        }
    }

    confirmClose() {
        localStorage.setItem('dirtyOvervide', "1");
        $('#confirm-close').modal('hide');

        // Check to see if we were trying to go somewhere other than previous, if not go back to previous
        var prev = localStorage.getItem('goto') ? localStorage.getItem('goto') : '';
        
        if (prev == '') {
            prev = localStorage.getItem('prev') ? localStorage.getItem('prev') : '/home';
        }

        if (prev.includes('event'))
            prev = '/';

        this.router.navigate([prev]);
    }

    submitRequest(form: FormGroup) {
        this.isSubmitting = true;
        form.markAllAsTouched();
        var valid = form.valid;
        
        if (valid && this.canSubmit()) {
            this.request.submittedBy = this.userService.user.upn;
            this.request.submitter = this.userService.user.displayName;
            this.request.status = EventStatus.UNASSIGNED;
            this.save(true, true);
            this.disableForm();
        } else {
            this.save(false, false);
            this.scrollToFirstInvalidControl();
            this.findInvalidControls();
        }
    }

    public invalidControls = [];

    public findInvalidControls() {
        this.invalidControls = [];
        const controls = this.eventRequestForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                this.invalidControls.push(name);
            }
        }
        return this.invalidControls;
    }

    private scrollToFirstInvalidControl() {
        const firstElementWithError: HTMLElement = document.querySelector('#top');

        if (firstElementWithError) {
            firstElementWithError.scrollIntoView({ behavior: 'smooth' });
        }
    }

    disableForm(): void {
        if (!this.canSave()) {
            $('input,textarea').prop('disabled', true);
            $('.add-row').hide();
        }
    }

    saveAndClose() {
        this.save(false, true);
    }

    isSubmitting: boolean = false;

    save(submitting: boolean, close: boolean = false): void {
        if (this.request.status.includes('Open') && !submitting) {
            if (!window.confirm('The form you are making changes to has already been submitted. If you save these changes you will be required to re-submit the form. Press OK to proceed.')) {
                return;
            }
        }

        this.request = Object.assign(this.request, this.eventRequestForm.value);

        this.request.eventRequestAttendees.forEach(x => {
            x.employeeUpn = x.employee?.upn;
            x.employeeName = x.employee?.displayName;
        });

        this.request.typeOfOrg = this.getBitValue(this.orgTypes.value);
        this.request.typeOfHost = this.getBitValue(this.hostOrgTypes.value);

        if (submitting)
            this.request.status = EventStatus.UNASSIGNED;
        else
            this.request.status = EventStatus.DRAFT;

        if (this.canSave() || submitting) {
            this.eventService.save(this.request)
                .then(response => {
                    this.saveComplete(close, response);
                });
        }
    }

    getFiles(type: string): FileInfo[] {
        var files: FileInfo[] = [];

        this.request.eventRequestAttachments.forEach(attachment => {
            if (attachment.type == type) {
                files.push(this.mapToFileInfo(attachment));
            }
        });

        return files;
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

    saveComplete(close: boolean, eventRequest: EventRequest): void {
        if (close) {
            this.confirmClose();
        }
        else {
            this.initialize(eventRequest);

            $("#success-alert").alert();

            $("#success-alert").fadeTo(2000, 500).slideUp(1000, function () {
                $("#success-alert").slideUp(1000);
            });
        }
    }

    print(): void {
        window.print();
    }

    uploadComplete(files: FileInfo[]) {
        if (files && files.length > 0)
            this.invitations.push(files[0]);
    }

    removeFile(files: FileInfo[]) {
        if (files && files.length > 0) {
            this.invitations = this.invitations.filter(x => x.uid != files[0].uid);
        }
    }

    closeModal(id: string): void {
        this.toggleModal(id, 'hide');
    }

    showModal(id: string): void {
        this.toggleModal(id, 'show');
    }

    toggleModal(id: string, action: "show" | "hide"): void {
        $('#' + id).modal(action);
    }
}

export class OrgType {
    public nonProfit: boolean;
    public mediaOrg: boolean;
    public lobbyingOrg: boolean;
    public usgEntity: boolean;
    public foreignGov: boolean;

    get value(): number {
        return (this.nonProfit == true ? 1 : 0) + (this.mediaOrg == true ? 2 : 0) + (this.lobbyingOrg == true ? 4 : 0) + (this.usgEntity == true ? 8 : 0) + (this.foreignGov == true ? 16 : 0);
    }
}
