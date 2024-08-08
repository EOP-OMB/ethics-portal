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

        
        
    }

    public showVideo(vid: TrainingVideo): void {
        this.selectedFile = null;
        this.selectedFile = vid;
    }
}
