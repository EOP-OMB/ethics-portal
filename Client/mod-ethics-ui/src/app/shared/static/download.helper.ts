import { HttpEventType } from "@angular/common/http";
import { FileInfo } from "@progress/kendo-angular-upload";
import { IAttachmentService } from "../services/attachment.service";

export class DownloadHelper {
    public static downloadFile(info: FileInfo, attachmentService: IAttachmentService) {
        if (info.uid && attachmentService) {
            attachmentService.downloadFile(info.uid).subscribe(
                data => {
                    switch (data.type) {
                        case HttpEventType.Response:
                            if (data.body) {
                                const downloadedFile = new Blob([data.body], { type: data.body.type });
                                const a = document.createElement('a');
                                a.setAttribute('style', 'display:none;');
                                document.body.appendChild(a);
                                a.download = info.name;
                                a.href = URL.createObjectURL(downloadedFile);
                                a.target = '_blank';
                                a.click();
                                document.body.removeChild(a);
                            }
                            break;
                    }
                },
                error => {
                    alert("Error downloading file");
                }
            );
        }
    }
}
