import { Component, OnInit } from '@angular/core';
import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { EoyReport } from '../../models/eoy-report.model';
import { ReportService } from '../../services/report.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-reports-view',
    templateUrl: './reports-view.component.html',
    styleUrls: ['./reports-view.component.scss']
})
export class ReportsViewComponent implements OnInit {

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
