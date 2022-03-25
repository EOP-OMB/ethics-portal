import { Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';

import { PropertyOptions } from 'mat-table-filter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { FormFilter } from '@shared/models/form-filter.model';
import { Helper } from '@shared/static/helper.funcs';
import { SelectionModel } from '@angular/cdk/collections';
import { ReportingStatus } from '../../static/reporting-status.const';
import { FormStatus } from '../../static/form-status.const';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LoadingService } from 'mod-framework';
import { TableBaseComponent } from '../table-base/table-base.component';
import { CachedTableComponent } from '../cached-table/cached-table.component';

@Component({
    selector: 'app-form-table',
    templateUrl: './form-table.component.html',
    styleUrls: ['./form-table.component.scss']
})
export class FormTableComponent extends CachedTableComponent<OgeForm450, FormFilter>  {
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

    constructor(protected loadingService: LoadingService, protected differs: KeyValueDiffers) {
        super(loadingService, differs);

        this.filter = new FormFilter();

        // set filter dropdowns
        this.years = Lookups.YEARS;
        this.reportingStatuses = Lookups.REPORTING_STATUSES;
        this.statuses = Lookups.FORM_STATUSES;
        this.flags = Lookups.FORM_FLAGS;

        this.propertyOptions = {
            dateOfEmployeeSignature: (date: string) => {
                let match = false;
                var days = Helper.getDaysSince(date);
                if (this.filter.dateOfEmployeeSignature == "")
                    match = true;
                else if (this.filter.dateOfEmployeeSignature == "lessThan30")
                    match = days <= 30;
                else if (this.filter.dateOfEmployeeSignature == "moreThan30")
                    match = days > 30;

                return match;
            }
        };
    }

    resetCols(): void {
        this.displayedColumns = [];
        this.showSelect = this.selectable;

        if (this.showSelect && !this.displayedColumns.find(x => x == "select"))
            this.displayedColumns.push('select');

        this.displayedColumns.push('employeesName');

        if (this.showColumn("year"))
            this.displayedColumns.push('year');

        this.displayedColumns.push('reportingStatus');
        this.displayedColumns.push('formStatus');
        this.displayedColumns.push('dateSubmitted');

        if (this.showColumn("dateOfEmployeeSignature"))
            this.displayedColumns.push('dateOfEmployeeSignature');

        this.displayedColumns.push('formFlags');

        this.displayedColumns.push('dueDate');

        if (this.showColumn("assignedTo"))
            this.displayedColumns.push('assignedTo');

        //this.resetFilters();
    }

    formatFlags(flag: string): string {
        if (flag.endsWith('|'))
            return flag.substr(0, flag.length - 1);
        else
            return flag;
    }

    getHiddenExportCols() {
        var an = new Array<number>();
        var index = -1;

        index = this.getColumnIndex("select");
        if (index > 0)
            an.push(index);

        //index = this.getColumnIndex("formFlags");
        //if (index > 0)
        //    an.push(index);

        return an;
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
    }

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

            //if (this.formFilter.dueDate != null)
            //    result = true;
        }

        return result;
    }

    assignSelected(): void {
        this.assignClicked.emit(this.selection.selected);
    }

    certify(type: string): void {
        this.certifyClicked.emit(type);
    }
}
