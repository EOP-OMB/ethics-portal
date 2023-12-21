import { Component } from '@angular/core';
import { LoadingService } from 'mod-framework';
import { Training } from '../../models/training.model';
import { TableBaseComponent } from '../table-base/table-base.component';

@Component({
  selector: 'app-training-export-table',
  templateUrl: './training-export-table.component.html',
  styleUrls: ['./training-export-table.component.scss']
})
export class TrainingExportTableComponent extends TableBaseComponent<Training> {
    constructor(protected loadingService: LoadingService) {
        super(loadingService);
        this.resetCols();
    }

    dataChanged(): void {
        if (this.data && this.data.length > 0) {
            setTimeout(() => {
                this.exportToExcel('ethics-training');
            }, 0);
        }
    }

    resetCols(): void {
        this.displayedColumns = [];
        this.showSelect = this.selectable;

        if (this.showSelect && !this.displayedColumns.find(x => x == "select"))
            this.displayedColumns.push('select');

        this.displayedColumns.push('employeeName');
        this.displayedColumns.push('employeeStatus');
        this.displayedColumns.push('year');
        this.displayedColumns.push('trainingType');
        this.displayedColumns.push('ethicsOfficial');
        this.displayedColumns.push('location');
        this.displayedColumns.push('trainingDate');
    }
}
