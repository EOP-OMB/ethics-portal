import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { PropertyOptions } from 'mat-table-filter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { Helper } from '@shared/static/helper.funcs';
import { Employee } from '@shared/models/employee.model';
import { EmployeeFilter } from '@app/shared/models/employee-filter.model';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LoadingService } from 'mod-framework';
import { CachedTableComponent } from '@shared/components/cached-table/cached-table.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'app-employee-table',
    templateUrl: './employee-table.component.html',
    styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent extends CachedTableComponent<Employee, EmployeeFilter> implements AfterViewInit {

    filerTypes: SelectItem[];
    employeeStatuses: SelectItem[];
    formStatuses: SelectItem[];
    reportingStatuses: SelectItem[];

    @Input()
    reviewers: SelectItem[] = [];

    public displayedColumns: string[] = [];

    constructor(protected loadingService: LoadingService, protected differs: KeyValueDiffers) {
        super(loadingService, differs);

        this.filter = new EmployeeFilter();

        // set filter dropdowns
        this.filerTypes = Lookups.FILER_TYPES;
        this.employeeStatuses = Lookups.DETAILEE_TYPE;
        this.reportingStatuses = Lookups.REPORTING_STATUSES;
        this.formStatuses = Lookups.FORM_STATUSES;

        this.propertyOptions = {
            last450Date: (date: Date | undefined) => {
                let match = false;

                if (date != undefined) {
                    var dateString = date.toString();
                    var days = Helper.getDaysSince(dateString);
                    if (this.filter.last450Date == "")
                        match = true;
                    else if (this.filter.last450Date == "lessThanOneYear")
                        match = days <= 365;
                    else if (this.filter.last450Date == "oneToTwoYears")
                        match = days > 365 && days <= 730;
                    else if (this.filter.last450Date == "moreThanTwoYears")
                        match = days > 730;
                } else if (this.filter.last450Date == "never") {
                    return true;
                }

                return match;
            }
        };
    }

    ngAfterViewInit(): void {
        if (!this.sort.active || this.sort.active == '')
            this.sort.sort(({ id: 'displayName', start: 'asc' }) as MatSortable);
    }

    public showColumn(col: string): boolean {
        return !this.hiddenCols.find(x => x == col)
    }

    resetCols(): void {
        this.displayedColumns = [];

        this.displayedColumns.push('displayName');
        this.displayedColumns.push('filerType');
        this.displayedColumns.push('employeeStatus');
        this.displayedColumns.push('reportingStatus');
        this.displayedColumns.push('currentFormStatus');
        this.displayedColumns.push('last450Date');
    }

    dataChanged(): void {

    }

    public resetFilters(): void {
        this.filter = new EmployeeFilter();
    }

    isFiltered(): boolean {
        var result = false;

        if (this.filter) {
            if (this.filter.displayName != '')
                result = true;

            if (this.filter.filerType != '' && this.filter.reportingStatus != 'All')
                result = true;

            if (this.filter.reportingStatus != '' && this.filter.reportingStatus != 'All')
                result = true;

            if (this.filter.employeeStatus != '' && this.filter.employeeStatus != 'All')
                result = true;

            if (this.filter.last450Date != '' && this.filter.last450Date != 'All')
                result = true;

            if (this.filter.currentFormStatus != "" && this.filter.currentFormStatus != 'All')
                result = true;
        }

        return result;
    }
}
