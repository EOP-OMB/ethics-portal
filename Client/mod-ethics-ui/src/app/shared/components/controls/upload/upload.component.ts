import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileInfo, FileRestrictions, RemoveEvent, SuccessEvent, UploadEvent, SelectEvent } from '@progress/kendo-angular-upload';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

    @Input()
    saveUrl: string = '';

    @Input()
    removeUrl: string = '';

    @Input()
    foreignKey: number = 0;

    @Input()
    files: FileInfo[] = [];

    @Input()
    guid: string = '';

    @Input()
    restrictions: FileRestrictions = {};

    @Output()
    download = new EventEmitter<FileInfo>();

    errors: string[] = [];

    constructor() { }

    ngOnInit(): void {
        
    }

    onBeforeUpload(e: UploadEvent) {
        e.data = {
            attachedToGuid: this.guid,
            uid: (e.files && e.files.length > 0) ? e.files[0].uid : "",
            foreignKey: this.foreignKey
        };
    }

    onUploaded(e: SuccessEvent) {
        
        
    }

    onSelect(e: SelectEvent) {
        var removeAt: string[] = [];
        this.errors = [];

        if (e.files) {
            e.files.forEach(file => {
                if (file.validationErrors && file.validationErrors.length > 0) {
                    if (file.uid)
                        removeAt.push(file.uid);

                    file.validationErrors.forEach(err => this.errors.push(this.lookupError(err)));
                    e.preventDefault();
                }
            })
        }
    }

    onBeforeRemove(e: RemoveEvent) {
        e.data = {
            uid: (e.files && e.files.length > 0) ? e.files[0].uid : ""
        };
    }

    onDownloadClick(info: FileInfo) {
        this.download.emit(info);
    }

    lookupError(err: string): string {
        switch (err) {
            case "invalidFileExtension":
                return "File type not allowed.";
            case "invalidMaxFileSize":
                return "File size too large.";
            case "invalidMinFileSize":
                return "File size too small.";
        }

        return err;
    }
}
