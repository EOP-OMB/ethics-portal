import { Component } from '@angular/core';
import { OutsidePosition } from '@shared/models/outside-position.model';
import { LoadingService } from 'mod-framework';
import { TableBaseComponent } from '@shared/components/table-base/table-base.component';

@Component({
  selector: 'app-outside-positions-export-table',
  templateUrl: './outside-positions-export-table.component.html',
  styleUrls: ['./outside-positions-export-table.component.scss']
})
export class OutsidePositionsExportTableComponent extends TableBaseComponent<OutsidePosition> {
    constructor(protected loadingService: LoadingService) {
        super(loadingService);
        this.resetCols();
    }

    dataChanged(): void {
        if (this.data && this.data.length > 0) {
            setTimeout(() => {
                this.exportToExcel('ethics-outside-positions');
            }, 10);
        }
    }

    resetCols(): void {
        this.displayedColumns = [
            'employeeName',
            'positionTitle',
            'organizationName',
            'startDate',
            'submittedDate',
            'status',
            'nextApprover'
        ];
    }
}
