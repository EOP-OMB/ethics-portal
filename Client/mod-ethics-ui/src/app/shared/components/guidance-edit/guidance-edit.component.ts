import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileInfo, FileRestrictions, FileState } from '@progress/kendo-angular-upload';
import { environment } from '@src/environments/environment';
import { Employee } from '../../models/employee.model';
import { Guid } from '../../models/guid.static';
import { Guidance } from '../../models/guidance.model';
import { SelectItem } from '../../models/select-item.interface';
import { GuidanceAttachmentService } from '../../services/guidance-attachment.service';
import { GuidanceSubjectService } from '../../services/guidance-subject.service';
import { GuidanceTypeService } from '../../services/guidance-type.service';
import { DownloadHelper } from '../../static/download.helper';

@Component({
    selector: 'app-guidance-edit',
    templateUrl: './guidance-edit.component.html',
    styleUrls: ['./guidance-edit.component.scss']
})
export class GuidanceEditComponent implements OnInit {

    @Input()
    employee: Employee;

    @Input()
    allowEmployeeSelect: boolean = true;

    @Input()
    guidance: Guidance = new Guidance();

    @Output()
    employeeClick = new EventEmitter<Employee>();

    @Output()
    save = new EventEmitter<Guidance>();

    @Output()
    delete = new EventEmitter<Guidance>();

    newGuid: string;
    guidanceTypes: SelectItem[];
    subjects: SelectItem[];

    selectedEmployee: Employee;

    saveUrl: string;
    removeUrl: string;

    public guidanceForm: FormGroup;

    get formEmployee() { return this.guidanceForm.get('employee'); }
    get guidanceType() { return this.guidanceForm.get('guidanceType'); }
    get subject() { return this.guidanceForm.get('subject'); }
    get guidanceText() { return this.guidanceForm.get('text'); }

    constructor(private typeService: GuidanceTypeService,
        private subjectService: GuidanceSubjectService,
        public attachmentService: GuidanceAttachmentService) {

        this.newGuid = Guid.newGuid();

        // set dropdowns
        this.guidanceTypes = [];
        this.subjects = [];

        this.typeService.getAll().then(response => {
            response.forEach(x => {
                var si: SelectItem = { text: x.text, value: x.id, group: '' }
                this.guidanceTypes.push(si);
            })
        });

        this.subjectService.getAll().then(response => {
            response.forEach(x => {
                var si: SelectItem = { text: x.text, value: x.id, group: '' }
                this.subjects.push(si);
            })
        });

        this.saveUrl = environment.apiUrl + "/api/guidanceAttachment/upload";
        this.removeUrl = environment.apiUrl + "/api/guidanceAttachment/remove";
    }

    files: FileInfo[] = [];
    restrictions: FileRestrictions = {
        allowedExtensions: [".xls", ".xlsx", ".doc", ".docx", ".jpg", ".pdf", ".png", ".csv"],
    };

    ngOnInit(): void {
        this.selectedEmployee = this.employee;

        let subjects = this.guidance.subject.split(',');

        this.guidanceForm = new FormGroup({
            id: new FormControl(this.guidance.id, null),
            dateOfGuidance: new FormControl(this.guidance.dateOfGuidance, Validators.required),
            employee: new FormControl(this.guidance.employee, Validators.required),
            guidanceType: new FormControl(this.guidance.guidanceType, Validators.required),
            subject: new FormControl(subjects, null),
            text: new FormControl(this.guidance.text, Validators.required),
            notifyEmployee: new FormControl(false),
            summary: new FormControl(this.guidance.summary, null),
            isShared: new FormControl(this.guidance.isShared, null)
        });

        if (this.guidance && this.guidance.attachments.length > 0) {
            this.guidance.attachments.forEach(att => {
                this.files.push({ name: att.name, size: att.size, uid: att.uid, rawFile: att.content, state: FileState.Initial });
            });
        }
    }

    submitted: boolean = false;

    onSubmit(guidanceForm: FormGroup) {
        this.submitted = true;
        if (guidanceForm.valid && this.selectedEmployee && this.selectedEmployee.id > 0) {
            let g: Guidance = Object.assign(new Guidance(), guidanceForm.value);

            g.subject = guidanceForm.value.subject.toString();
            g.employeeUpn = this.selectedEmployee.upn;
            g.employee = this.selectedEmployee;
            g.employeeName = this.selectedEmployee.displayName;
            g.filerType = this.selectedEmployee.filerType;
            g.guid = this.newGuid;

            this.save.emit(g);
        } 
    }

    employeeSelected(employee: Employee): void {
        this.selectedEmployee = employee;
    }

    clearEmployee() {
        this.selectedEmployee = new Employee();
        this.guidanceForm.get('employee')?.reset(); //setValue(this.selectedEmployee);
    }

    employeeClicked(employee: Employee) {
        this.employeeClick.emit(employee);
    }

    downloadFile(info: FileInfo) {
        DownloadHelper.downloadFile(info, this.attachmentService);
    }

    deleteGuidance() {
        if (confirm("Attempting to delete guidance, are you sure you want to continue?")) {
            this.delete.emit(this.guidance);
        }
    }
}

