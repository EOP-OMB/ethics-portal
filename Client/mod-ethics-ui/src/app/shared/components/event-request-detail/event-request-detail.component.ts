import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { EventRequest } from '@shared/models/event-request.model';
import { Attachment } from '@shared/models/attachment.model';
import { SelectItem } from '@shared/models/select-item.interface';
import { CurrentUserService } from 'mod-framework';
import { Router } from '@angular/router';
import { Lookups } from '@shared/static/lookups.static';
import { AttachmentType } from '@shared/static/attachment-type.const';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@src/environments/environment';
import { EventRequestService } from '@shared/services/event-request.service';
import { Roles } from '../../static/roles.const';
import { EventStatus } from '../../static/event-status.const';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-event-request-detail',
    templateUrl: './event-request-detail.component.html',
    styleUrls: ['./event-request-detail.component.scss']
})
export class EventRequestDetailComponent implements OnInit {
    @Input()
    event: EventRequest;

    @Input()
    reviewers: SelectItem[];

    @Output()
    saved = new EventEmitter<EventRequest>();

    @Output()
    close = new EventEmitter<EventRequest>();

    editEvent: EventRequest;

    travelForms: Attachment[];
    invitations: Attachment[];

    closedReason: string;
    closeStatus: string;

    statuses: SelectItem[];

    public closeForm: FormGroup;

    get reason() { return this.closeForm.get('reason'); }
    get comments() { return this.closeForm.get('comments'); }

    constructor(private formBuilder: FormBuilder,
        private userService: CurrentUserService,
        protected eventService: EventRequestService,
        private snackBar: MatSnackBar,
        private router: Router) {
    }

    ngOnInit(): void {
        localStorage.setItem('dirtyOvervide', "0");
        localStorage.setItem('goto', '');

        this.statuses = Lookups.EVENT_STATUSES.filter(x => x.value && x.value.indexOf('Closed -') >= 0);
    }

    prevAssignedToUpn: string;

    ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
        if (changes.event) {
            this.prevAssignedToUpn = this.event.assignedToUpn;
            this.editEvent = this.event;
            this.travelForms = this.editEvent.eventRequestAttachments.filter(x => x.type == AttachmentType.TRAVEL_FORMS);
            this.invitations = this.editEvent.eventRequestAttachments.filter(x => x.type == AttachmentType.INVIATIONS);

            this.closeForm = this.formBuilder.group({
                reason: ['', [Validators.required]],
                comments: [null]
            });
        }
    }

    getAttachment(uid: string) {
        window.open(environment.apiUrl + '/api/eventAttachment/download/' + uid, '_self');
    }

    getAttendeeAttachment(uid: string) {
        
        window.open(environment.apiUrl + '/api/attendeeAttachment/download/' + uid, '_self');
    }

    getOrgTypeDesc(orgFlag: number, other: string) {
        var desc = '';

        desc += ((orgFlag & 1) == 1 ? 'Non-Profit/501(c)(3), ' : '');
        desc += ((orgFlag & 2) == 2 ? 'Media Org., ' : '');
        desc += ((orgFlag & 4) == 4 ? 'Lobbying Org., ' : '');
        desc += ((orgFlag & 8) == 8 ? 'USG Entity, ' : '');
        desc += ((orgFlag & 16) == 16 ? 'Foreign Gov., ' : '');
        desc += other ? other : '';

        desc = desc.trim();

        if (desc.endsWith(','))
            desc = desc.substring(0, desc.length - 1);

        return desc;
    }

    downloadFile(blob: Blob) {
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    save(): void {
        this.closeModal();

        var upn = this.editEvent.assignedToUpn;
        if (upn && upn != 'na') {
            var reviewer = this.reviewers.filter(x => x.value == upn)[0];

            if (reviewer)
                this.editEvent.assignedTo = reviewer.text;
        } else {
            this.editEvent.assignedTo = '';
        }
        
        this.eventService.save(this.editEvent).then(response => {
            this.saved.emit(response);
        });
    }

    showModal() {
        $("#confirm-close").modal("show");
        $("#confirm-close").appendTo("body");
    }

    closeModal() {
        $("#confirm-close").modal("hide");
    }

    closeRequest() {
        if (this.closeForm.valid) {
            this.editEvent.closedReason = this.comments.value;
            this.editEvent.status = this.reason.value;

            this.save();
        }
    }

    resendAssignEmail() {
        this.eventService.resendAssignedToEmail(this.editEvent.id).then(response => {
            this.snackBar.open("Email re-sent Successfully", "", {
                duration: 10000
            });
        });
    }

    canAssign() {
        return this.userService.isInRole(Roles.Admin) && this.editEvent.status.includes('Open');
    }

    canEdit() {
        return (this.userService.isInRole(Roles.Admin) || (this.userService.isInRole(Roles.EventReviewer) && this.editEvent.assignedTo == this.userService.user.displayName)) && this.editEvent.status != EventStatus.DRAFT;
    }

    canClose() {
        return (this.userService.isInRole(Roles.Admin) || (this.userService.isInRole(Roles.EventReviewer) && this.editEvent.assignedTo == this.userService.user.displayName)) && this.editEvent.status.includes('Open') && !this.isAttending(this.editEvent);
    }

    isAttending(event: EventRequest): boolean {
        var isAttending: boolean = false;

        event.eventRequestAttendees.forEach(x => {
            if (x.employeeUpn == this.userService.user.upn)
                isAttending = true;
        });

        return isAttending;
    }

    isClosed() {
        return this.editEvent.status.includes('Closed');
    }

    cancel() {

    }

    gotoEmployee(id: number) {
        this.router.navigate(['/profile', id]);
    }
}
