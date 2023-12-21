import { Component, Input } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { LoadingService } from 'mod-framework';
import { TableBaseComponent } from '../table-base/table-base.component';

@Component({
    selector: 'app-form-export-table',
    templateUrl: './form-export-table.component.html',
    styleUrls: ['./form-export-table.component.scss']
})
export class FormExportTableComponent extends TableBaseComponent<OgeForm450> {
    constructor(protected loadingService: LoadingService) {
        super(loadingService);
        this.resetCols();
    }

    dataChanged(): void {
        if (this.data && this.data.length > 0) {
            setTimeout(() => {
                this.exportToExcel('ethics-forms');    
            }, 0);
        }
    }

    resetCols(): void {
        this.displayedColumns = [];

        this.displayedColumns.push('employeesName');
        this.displayedColumns.push('year');
        this.displayedColumns.push('reportingStatus');
        this.displayedColumns.push('formStatus');
        this.displayedColumns.push('dateSubmitted');
        this.displayedColumns.push('dateOfEmployeeSignature');
        this.displayedColumns.push('formFlags');
        this.displayedColumns.push('dueDate');
        this.displayedColumns.push('assignedTo');
    }

    formatFlags(flag: string): string {
        if (flag.endsWith('|'))
            return flag.substring(0, flag.length - 1);
        else
            return flag;
    }
}
