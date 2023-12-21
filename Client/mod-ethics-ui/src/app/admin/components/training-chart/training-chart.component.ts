import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '@shared/services/training.service';
import { TrainingChart } from '../../../shared/models/training-chart.model';

@Component({
    selector: 'app-training-chart',
    templateUrl: './training-chart.component.html',
    styleUrls: ['./training-chart.component.scss']
})
export class TrainingChartComponent {
    public pieData: any = [];
    public seriesColors: string[] = [
        "#d9534f",
        "#5cb85c",
    ];

    @Input()
    year: number;

    chartData: TrainingChart;
    get missingEmployeesCount() { return this.chartData ? this.chartData.totalEmployees - this.chartData.completedTraining : 0 }
    constructor(private trainingService: TrainingService, private router: Router) {
        
    }

    ngOnInit(): void {
        this.initializeChart(this.year);
    }

    public initializeChart(year: number) {
        this.year = year;

        this.trainingService.getChart(year).then(chartData => {
            this.chartData = chartData;
        });
    }

    gotoReport(type: string) {
        if (type == 'EOY') {
            this.router.navigate(['/admin/eoy-report']);
        }
    }
}
