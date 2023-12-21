import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Attendee } from '@shared/models/attendee.model';
import { CurrentUserService } from 'mod-framework';
import { Employee } from '@shared/models/employee.model';
import { EmployeeService } from '@shared/services/employee.service';
import { FileInfo, FileRestrictions } from '@progress/kendo-angular-upload';
import { environment } from '@src/environments/environment';
import { Guid } from '@shared/models/guid.static';
import { AttachmentType } from '@shared/static/attachment-type.const';
import { Attachment } from '@shared/models/attachment.model';
import { DownloadHelper } from '@shared/static/download.helper';
import { AttendeeAttachmentService } from '@shared/services/attendee-attachment.service';

@Component({
    selector: 'app-attendee',
    templateUrl: './attendee.component.html',
    styleUrls: ['./attendee.component.scss']
})
export class AttendeeComponent implements OnInit {
    @Input()
    attendeeForm: FormGroup;

    @Output()
    delete = new EventEmitter<any>();

    parentForeignKey: number = 0;

    uploadSaveUrl = "saveUrl"; // should represent an actual API endpoint
    uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint

    attachments: FileInfo[] = [];

    restrictions: FileRestrictions = {
        allowedExtensions: [".xls", ".xlsx", ".doc", ".docx", ".jpg", ".pdf", ".png", ".csv"],
        maxFileSize: 1073741824
    };
    get id() { return this.attendeeForm.get('id'); }
    get attachmentGuid() { return this.attendeeForm.get('attachmentGuid'); }
    get employee() { return this.attendeeForm.get('employee'); }
    get nameOfSupervisor() { return this.attendeeForm.get('nameOfSupervisor'); }
    get informedSupervisor() { return this.attendeeForm.get('informedSupervisor'); }
    get employeeType() { return this.attendeeForm.get('employeeType'); }
    get capacity() { return this.attendeeForm.get('capacity'); }
    get isGivingRemarks() { return this.attendeeForm.get('isGivingRemarks'); }
    get remarks() { return this.attendeeForm.get('remarks'); }
    get reasonForAttending() { return this.attendeeForm.get('reasonForAttending'); }

    get isSpeakerAgreementRequired() { return this.attendeeForm.get('isSpeakerAgreementRequired'); }
    get attendeeAttachments() { return this.attendeeForm.get('attendeeAttachments'); }

    constructor(private userService: CurrentUserService,
        private employeeService: EmployeeService,
        private attachmentService: AttendeeAttachmentService) {

        this.uploadSaveUrl = environment.apiUrl + "/api/attendeeAttachment/upload";
        this.uploadRemoveUrl = environment.apiUrl + "/api/attendeeAttachment/remove";
    }

    ngOnInit(): void {
        this.parentForeignKey = this.id.value;

        this.isGivingRemarks.valueChanges.subscribe(isGivingRemarks => {
            if (!isGivingRemarks) {
                this.remarks.clearValidators();
                this.remarks.updateValueAndValidity();

                this.isSpeakerAgreementRequired.clearValidators();
                this.isSpeakerAgreementRequired.updateValueAndValidity();
            }
            else {
                this.remarks.setValidators(Validators.required);
                this.isSpeakerAgreementRequired.setValidators(Validators.required);
            }
        });

        this.attachments = this.getFiles(AttachmentType.SPEAKER_AGREEMENT);
    }

    getFiles(type: string): FileInfo[] {
        var files: FileInfo[] = [];

        if (this.attendeeAttachments && this.attendeeAttachments.value) {
            this.attendeeAttachments.value.forEach(attachment => {
                if (attachment.type == type) {
                    files.push(this.mapToFileInfo(attachment));
                }
            });
        }

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

    assignMe() {
        this.employeeService.getMyProfile().then(response => this.attendeeForm.patchValue({ employee: response }));
    }

    employeeSelect(employee: Employee) {
        if (employee && employee.reportsTo) {
            this.nameOfSupervisor.patchValue(employee.reportsTo.displayName);
        }
    }

    removeAttendee() {
        this.delete.emit();
    }

    amIGoing(): boolean {
        return this.userService.user.upn == this.employee.value?.upn;
    }

    downloadFile(info: FileInfo) {
        DownloadHelper.downloadFile(info, this.attachmentService);
    }

    uploadComplete(files: FileInfo[]) {
        if (files && files.length > 0)
            this.attachments.push(files[0]);
    }

    removeFile(files: FileInfo[]) {
        if (files && files.length > 0) {
            this.attachments = this.attachments.filter(x => x.uid != files[0].uid);
        }
    }
}
