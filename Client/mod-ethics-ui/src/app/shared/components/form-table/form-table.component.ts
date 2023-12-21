import { Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { FormFilter } from '@shared/models/form-filter.model';
import { ReportingStatus } from '../../static/reporting-status.const';
import { FormStatus } from '../../static/form-status.const';
import { LoadingService } from 'mod-framework';
import { ServerSideTableComponent } from '../server-side-table/server-side-table.component';
import { Observable } from 'rxjs';
import { TableData } from '../../models/table-data.model';
import { OGEForm450Service } from '../../services/oge-form-450.service';
import { FormFlags } from '../../static/form-flags.const';
import { MatSortable, MatSortHeader } from '@angular/material/sort';
import { FormExportTableComponent } from '../form-export-table/form-export-table.component';

@Component({
    selector: 'app-form-table',
    templateUrl: './form-table.component.html',
    styleUrls: ['./form-table.component.scss']
})
export class FormTableComponent extends ServerSideTableComponent<OgeForm450, FormFilter>  {
    @Input()
    reviewers: SelectItem[] = [];

    @Output()
    assignClicked = new EventEmitter<OgeForm450[]>();

    @Output()
    certifyClicked = new EventEmitter<string>();

    // Actions
    numberOfBlankForms: number = 0;
    numberOfUnchangedForms: number = 0;

    years: SelectItem[];
    reportingStatuses: SelectItem[];
    statuses: SelectItem[];
    flags: SelectItem[];

    isFiltered(): boolean {
        var result = false;

        if (this.filter) {
            if (this.filter.employeesName != '')
                result = true;

            if (this.filter.year != 0)
                result = true;

            if (this.filter.reportingStatus != '' && this.filter.reportingStatus != 'All')
                result = true;

            if (this.filter.formStatus != '' && this.filter.formStatus != 'All')
                result = true;

            if (this.filter.formFlags != '')
                result = true;

            if (this.filter.dateOfEmployeeSignature != '')
                result = true;

            if (this.filter.assignedTo != "")
                result = true;
        }

        return result;
    }

    constructor(private service: OGEForm450Service, protected loadingService: LoadingService, protected differs: KeyValueDiffers) {
        super(loadingService, differs);

        this.filter = new FormFilter();

        // set filter dropdowns
        this.years = Lookups.YEARS;
        this.reportingStatuses = Lookups.REPORTING_STATUSES;
        this.statuses = Lookups.FORM_STATUSES;
        this.flags = Lookups.FORM_FLAGS;

        this.sortString = 'dueDate';
        this.sortOrder = 'desc';
    }

    getTableData$(page: number, pageSize: number, sort: string, sortOrder: string): Observable<TableData<OgeForm450>> {
        
        this.page = page;
        this.pageSize = pageSize;

        if (sort) {
            this.sortString = sort;
            this.sortOrder = sortOrder;
        }

        var filter = this.getFilter();

        return this.service.getTable(this.page, this.pageSize, this.sortString, this.sortOrder, filter);
    }

    getFilter(): string {
        var filter = '';

        if (this.filter.employeesName != '') {
            filter += 'employeesName|' + this.filter.employeesName + ';';
        }
        if (this.filter.year != 0) {
            filter += 'year|' + this.filter.year + ';';
        }
        if (this.filter.reportingStatus != '') {
            filter += 'reportingStatus|' + this.filter.reportingStatus + ';';
        }
        if (this.filter.formStatus != '') {
            filter += 'formStatus|' + this.filter.formStatus + ';';
        }
        if (this.filter.formFlags != '') {
            filter += 'formFlags|' + this.filter.formFlags + ';';
        }
        if (this.filter.dateOfEmployeeSignature != '') {
            filter += 'dateOfEmployeeSignature|' + this.filter.dateOfEmployeeSignature + ';';
        }
        if (this.filter.assignedTo != '') {
            filter += 'assignedTo|' + this.filter.assignedTo + ';';
        }
        //if (this.filter.reviewStatus != '') {
        //    filter += 'reviewStatus|' + this.filter.reviewStatus + ';';
        //}
        if (this.filter.substantiveReviewerUpn != '') {
            filter += 'substantiveReviewerUpn|' + this.filter.substantiveReviewerUpn + ';';
        }

        if (filter.endsWith(';'))
            filter = filter.substring(0, filter.length - 1);

        return filter;
    }

    resetCols(): void {
        this.displayedColumns = [];
        this.showSelect = this.selectable;

        if (this.showSelect && !this.displayedColumns.find(x => x == "select"))
            this.displayedColumns.push('select');

        this.displayedColumns.push('employeesName');

        if (this.showColumn("createdTime"))
            this.displayedColumns.push('createdTime');

        this.displayedColumns.push('reportingStatus');
        this.displayedColumns.push('formStatus');
        this.displayedColumns.push('dateSubmitted');

        if (this.showColumn("dateOfEmployeeSignature"))
            this.displayedColumns.push('dateOfEmployeeSignature');

        this.displayedColumns.push('formFlags');

        this.displayedColumns.push('dueDate');

        if (this.showColumn("assignedTo"))
            this.displayedColumns.push('assignedTo');

        this.displayedColumns.push('substantiveReviewer');
        this.displayedColumns.push('dateOfSubstantiveReview');
        /*this.displayedColumns.push('reviewStatus');*/

        //this.resetFilters();
    }

    formatFlags(flag: string): string {
        if (flag.endsWith('|'))
            return flag.substring(0, flag.length - 1);
        else
            return flag;
    }

    dataChanged(): void {
        var submittedForms = this.data.filter(x => x.formStatus == FormStatus.SUBMITTED || x.formStatus == FormStatus.RE_SUBMITTED);

        var blankForms = submittedForms.filter(x => x.isBlank && x.reportingStatus == ReportingStatus.ANNUAL);
        this.numberOfBlankForms = blankForms.length;

        var unchangedForms = submittedForms.filter(x => x.isUnchanged);
        this.numberOfUnchangedForms = unchangedForms.length;
    }

    public resetFilters(): void {
        this.filter = new FormFilter();
        this.search();
    }

    assignSelected(): void {
        this.assignClicked.emit(this.selection.selected);
    }

    certify(type: string): void {
        this.certifyClicked.emit(type);
    }

    search(): void {
        this.paginator.pageIndex = 0;
        this.filterChange.emit(this.filter);
    }

    public filterBy(type: string) {
        this.filter = new FormFilter();

        switch (type.toLowerCase()) {
            case "submitted":
                this.filter.formStatus = FormStatus.SUBMITTED;
                break;
            case "overdue":
                this.filter.formFlags = FormFlags.OVERDUE;
                break;
            case "readytocert":
                this.filter.formStatus = FormStatus.READY_TO_CERT;
                break;
        }

        this.search();
    }

    exportData: OgeForm450[];

    public exportClick(): void {
        var filter = this.getFilter();

        this.loadingService.isLoading.next(true);

        this.service.getTable(1, this.totalData, this.sortString, this.sortOrder, filter).subscribe(response => {
            this.exportData = response.data;
        });
    }
}
