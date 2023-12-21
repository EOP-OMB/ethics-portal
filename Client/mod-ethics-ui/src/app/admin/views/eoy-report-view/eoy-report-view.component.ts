import { Component, OnInit } from '@angular/core';
import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { EoyReport } from '../../models/eoy-report.model';
import { ReportService } from '../../services/report.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-eoy-report-view',
    templateUrl: './eoy-report-view.component.html',
    styleUrls: ['./eoy-report-view.component.scss']
})
export class EoyReportViewComponent implements OnInit {

    public eoy: EoyReport = new EoyReport();
    public selectedYear: string = '2021';

    years: SelectItem[];
    hiddenCols: string[] = ['assignedTo', 'dateOfEmployeeSignature'];

    constructor(private reportService: ReportService) {
        this.years = Lookups.YEARS;
    }

    ngOnInit(): void {
        this.loadEoyReport(this.selectedYear);
    }

    loadEoyReport(selectedYear: string): void {
        this.reportService.getEoyReport(+selectedYear).then(report => this.eoy = report);
    }

    yearChange(selection: MatSelectChange) {
        this.loadEoyReport(this.selectedYear);
    }
}
