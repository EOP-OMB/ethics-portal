import { Component, OnInit, ViewChild } from '@angular/core';
import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { EoyReport } from '../../models/eoy-report.model';
import { ReportService } from '../../services/report.service';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { OgeForm450StatusChartComponent } from '../../components/oge-form450-status-chart/oge-form450-status-chart.component';
import { TrainingChartComponent } from '../../components/training-chart/training-chart.component';
import { EventRequestChartComponent } from '../../components/event-request-chart/event-request-chart.component';
import { TrainingService } from '@shared/services/training.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-reports-view',
    templateUrl: './reports-view.component.html',
    styleUrls: ['./reports-view.component.scss']
})
export class ReportsViewComponent implements OnInit {

    selectedYear: number;
    currentYear: number;
    years: number[] = [];

    @ViewChild('ogeForm450Chart')
    ogeForm450Chart: OgeForm450StatusChartComponent;

    @ViewChild('trainingChart')
    trainingChart: TrainingChartComponent;

    @ViewChild('eventChart')
    eventChart: EventRequestChartComponent;

    constructor(private trainingService: TrainingService,
        private router: Router) {
        this.currentYear = new Date().getFullYear();
        this.selectedYear = this.currentYear;

        this.years.push(this.currentYear);

        for (let i = 1; i <= 6; i++) {
            this.years.push(this.currentYear - i);
        }
    }

    ngOnInit(): void {

    }

    gotoReport(type: string) {
        if (type == 'EOY') {
            this.router.navigate(['/admin/eoy-report']);
        }
    }

    changeTrainingYear(year: number) {
        this.selectedYear = year;
        this.trainingChart.initializeChart(this.selectedYear);
    }

    public refresh(type: string) {
        switch (type) {
            case "450Status":
                this.ogeForm450Chart.initializeChart();
                break;
            case "Training":
                this.trainingChart.initializeChart(this.selectedYear);
                break;
            case "Events":
                this.eventChart.initializeChart();
                break;
        }
    }

    downloadTrainingReport(type: string, days: number): void {
        switch (type) {
            case 'initial':
                this.trainingService
                    .getMissingInitialTrainingReport(this.selectedYear, days)
                    .subscribe({
                        next: (response) => {
                            switch (response.type) {
                                case HttpEventType.Response:
                                    if (response.body) {
                                        const downloadedFile = new Blob([response.body], { type: response.body.type });
                                        const a = document.createElement('a');
                                        a.setAttribute('style', 'display:none;');
                                        document.body.appendChild(a);
                                        a.download = this.selectedYear.toString() + "MissingInitial" + days.toString() + ".csv";
                                        a.href = URL.createObjectURL(downloadedFile);
                                        a.target = '_blank';
                                        a.click();
                                        document.body.removeChild(a);
                                    }
                                    break;
                            }
                        },
                        error: this.handleError.bind(this)
                    });
                break;
            case 'missingAnnual':
                this.trainingService
                    .getMissingTrainingReport(this.selectedYear)
                    .subscribe({
                        next: (response) => {
                            switch (response.type) {
                                case HttpEventType.Response:
                                    if (response.body) {
                                        const downloadedFile = new Blob([response.body], { type: response.body.type });
                                        const a = document.createElement('a');
                                        a.setAttribute('style', 'display:none;');
                                        document.body.appendChild(a);
                                        a.download = this.selectedYear.toString() + "MissingAnnual.csv";
                                        a.href = URL.createObjectURL(downloadedFile);
                                        a.target = '_blank';
                                        a.click();
                                        document.body.removeChild(a);
                                    }
                                    break;
                            }
                        },
                        error: this.handleError.bind(this)
                    });
                break;
        }
        
    }

    getDownload(response: any, filename: string): (value: any) => void  {
        switch (response.type) {
            case HttpEventType.Response:
                if (response.body) {
                    const downloadedFile = new Blob([response.body], { type: response.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = filename;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                }
                break;
        }

        return response;
    }

    handleError(response: any) {
        console.log(response);
    }
}
