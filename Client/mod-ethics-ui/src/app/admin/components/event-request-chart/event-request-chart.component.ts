import { Component } from '@angular/core';
import { EventRequestService } from '@shared/services/event-request.service';
import { EventRequestChart } from '@shared/models/event-request-chart.model';
import { ValueAxisLabels } from '@progress/kendo-angular-charts';

@Component({  selector: 'app-event-request-chart',
  templateUrl: './event-request-chart.component.html',
  styleUrls: ['./event-request-chart.component.scss']
})
export class EventRequestChartComponent {

    chartData: EventRequestChart;

    public seriesColors: string[] = [
        "#337ab7",
        "#6c757d",
        "#5cb85c",
        "#d9534f",
        "#f0ad4e",
        "#5bc0de",
    ];

    axisLabels: string[];
    constructor(private eventService: EventRequestService) {

    }

    ngOnInit(): void {
        this.initializeChart();
    }

    public initializeChart() {
        this.eventService.getYearOverYearChart().then(chartData => {
            this.chartData = chartData;
            this.axisLabels = [];
            this.chartData.datasets.forEach(x => {
                this.axisLabels.push(x.label);
            })
        });
    }
}
