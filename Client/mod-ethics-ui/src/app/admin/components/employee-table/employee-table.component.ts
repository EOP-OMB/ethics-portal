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
    }

    ngAfterViewInit(): void {
        //if (!this.sort.active || this.sort.active == '')
        //    this.sort.sort(({ id: 'displayName', start: 'asc' }) as MatSortable);
    }

    public showColumn(col: string): boolean {
        return !this.hiddenCols.find(x => x == col)
    }

    resetCols(): void {
        this.displayedColumns = [];

        this.displayedColumns.push('displayName');
        this.displayedColumns.push('hireDate');
        this.displayedColumns.push('filerType');
        this.displayedColumns.push('employeeStatus');
        this.displayedColumns.push('reportingStatus');
        this.displayedColumns.push('currentFormStatus');
        this.displayedColumns.push('last450Date');
    }

    ngOnInit() {
        
    }

    dataChanged(): void {
        this.dataSource.filterPredicate = this.getFilterPredicate();
        this.applyFilter();
    }

    public resetFilters(filter: EmployeeFilter = null): void {
        if (!filter)
            this.filter = new EmployeeFilter();
        else
            this.filter = filter;

        this.applyFilter();
    }

    /* this method well be called for each row in table  */
    getFilterPredicate() {
        return (employee: Employee, filters: string) => {
            // split string per '$' to array
            const filterArray = filters.split('$');
            const employeeName = filterArray[0];
            const filerType = filterArray[1];
            const detaileeType = filterArray[2];
            const reportingStatus = filterArray[3];
            const formStatus = filterArray[4];
            const last450Date = filterArray[5];

            const matchFilter = [];

            // Fetch data from row
            const columnEmployeeName = employee.displayName ? employee.displayName : '';
            const columnFilerType = employee.filerType ? employee.filerType : '';
            const columnDetaileeType = employee.employeeStatus ? employee.employeeStatus : '';
            const columnReportingStatus = employee.reportingStatus ? employee.reportingStatus : '';
            const columnFormStatus = employee.currentFormStatus ? employee.currentFormStatus : '';
            const columnLastFileDate = employee.last450Date;

            // verify fetching data by our searching values
            const filterEmployeeName = !columnEmployeeName || columnEmployeeName.toLowerCase().includes(employeeName);
            const filterFilerType = !columnFilerType || columnFilerType.toLowerCase().includes(filerType);
            const filterDetaileeType = !columnDetaileeType || columnDetaileeType.toLowerCase().includes(detaileeType);
            const filterReportingStatus = !columnReportingStatus || columnReportingStatus.toLowerCase().includes(reportingStatus);
            const filterFormStatus = !columnFormStatus || columnFormStatus.toLowerCase().includes(formStatus);

            let match = true;

            if (columnLastFileDate != undefined && columnLastFileDate) {
                var dateString = columnLastFileDate.toString();
                var days = Helper.getDaysSince(dateString);

                if (last450Date == "")
                    match = true;
                else if (last450Date == "lessThanOneYear")
                    match = (days <= 365);
                else if (last450Date == "oneToTwoYears")
                    match = (days > 365 && days <= 730);
                else if (last450Date == "moreThanTwoYears")
                    match = (days > 730);
            } else if (last450Date == "never") {
                match = true;
            }

            const filterLastFileDate = match;

            // push boolean values into array
            matchFilter.push(filterEmployeeName);
            matchFilter.push(filterFilerType);
            matchFilter.push(filterDetaileeType);
            matchFilter.push(filterReportingStatus);
            matchFilter.push(filterFormStatus);
            matchFilter.push(filterLastFileDate);

            // return true if all values in array is true
            // else return false
            return matchFilter.every(Boolean);
        };
    }

    applyFilter() {
        // create string of our searching values and split if by '$'
        const filterValue = this.filter.displayName + '$' + this.filter.filerType + '$' + this.filter.employeeStatus + '$' + this.filter.reportingStatus + '$' + this.filter.currentFormStatus + '$' + this.filter.last450Date;
        this.dataSource.filter = filterValue.trim().toLowerCase();
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
