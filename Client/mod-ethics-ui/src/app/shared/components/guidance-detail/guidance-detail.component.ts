import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileInfo, FileState } from '@progress/kendo-angular-upload';
import { Employee } from '../../models/employee.model';
import { Guidance } from '../../models/guidance.model';
import { GuidanceAttachmentService } from '../../services/guidance-attachment.service';
import { DownloadHelper } from '../../static/download.helper';

@Component({
    selector: 'app-guidance-detail[guidance]',
    templateUrl: './guidance-detail.component.html',
    styleUrls: ['./guidance-detail.component.scss']
})
export class GuidanceDetailComponent implements OnInit {

    @Input()
    guidance!: Guidance;

    @Output()
    employeeClick = new EventEmitter<Employee>();

    constructor(private sanitizer: DomSanitizer,  private attachmentService: GuidanceAttachmentService) { }

    html?: SafeHtml;
    files: FileInfo[] = [];

    ngOnInit(): void {
        this.html = this.sanitizer.bypassSecurityTrustHtml(this.guidance.text);

        if (this.guidance && this.guidance.attachments.length > 0) {
            this.guidance.attachments.forEach(att => {
                this.files.push({ name: att.name, size: att.size, uid: att.uid, rawFile: att.content, state: FileState.Initial });
            });
        }
    }

    employeeClicked(employee: Employee) {
        this.employeeClick.emit(employee);
    }

    downloadFile(info: FileInfo) {
        DownloadHelper.downloadFile(info, this.attachmentService);
    }
}
