import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OGEForm450Service } from '../../../shared/services/oge-form-450.service';

@Component({
  selector: 'app-oge-form450-status-chart',
  templateUrl: './oge-form450-status-chart.component.html',
  styleUrls: ['./oge-form450-status-chart.component.scss']
})
export class OgeForm450StatusChartComponent {
    public pieData: any = [];
    public seriesColors: string[] = [
        "#f8f9fa",
        "#5bc0de",
        "#f0ad4e",
        "#d9534f",
        "#337ab7",
        "#5cb85c",
    ];
    constructor(private formService: OGEForm450Service, private router: Router) {
        
    }

    ngOnInit(): void {
        this.initializeChart();
    }

    public initializeChart() {
        this.formService.getStatusChart().then(chartData => {
            this.pieData = [];
            for (let i = 0; i < chartData.data.length; i++) {
                this.pieData.push({ category: chartData.labels[i], value: chartData.data[i] });
            }
        });
    }

    gotoReport(type: string) {
        if (type == 'EOY') {
            this.router.navigate(['/admin/eoy-report']);
        }
    }
}
