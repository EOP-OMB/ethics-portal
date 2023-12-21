import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TrainingVideo } from '../../models/training-video.model';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-training-video-view',
  templateUrl: './training-video-view.component.html',
  styleUrls: ['./training-video-view.component.scss']
})
export class TrainingVideoViewComponent {
    public files: TrainingVideo[];

    public selectedFile: TrainingVideo;

    constructor(private http: HttpClient) {

    }

    ngOnInit(): void {

        this.http.get<TrainingVideo[]>('assets/training-videos.json').subscribe(response => {
            var files = [];
            var tempFiles = response.filter(x => environment.debug || x.environment == 'prod');
            tempFiles.forEach(x => files.push(Object.assign(new TrainingVideo(), x)));

            this.files = files;
        });
        
    }

    public showVideo(vid: TrainingVideo): void {
        this.selectedFile = null;
        this.selectedFile = vid;
    }
}
