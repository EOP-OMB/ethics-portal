import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ExtensionRequest } from '@shared/models/extension-request.model';

import { PropertyOptions } from 'mat-table-filter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { Helper } from '@shared/static/helper.funcs';
import { CachedTableComponent } from '../cached-table/cached-table.component';
import { LoadingService } from 'mod-framework';
import { ExtensionFilter } from '@shared/models/extension-filter.model';
import { ServerSideTableComponent } from '../server-side-table/server-side-table.component';
import { Observable } from 'rxjs';
import { TableData } from '../../models/table-data.model';
import { ExtensionRequestService } from '../../services/extension-request.service';
import { ExtensionStatus } from '../../static/extension-status.const';

@Component({
    selector: 'app-extension-table',
    templateUrl: './extension-table.component.html',
    styleUrls: ['./extension-table.component.scss']
})
export class ExtensionTableComponent extends ServerSideTableComponent<ExtensionRequest, ExtensionFilter> implements AfterViewInit  {

    years: SelectItem[];
    statuses: SelectItem[];

    constructor(private extensionService: ExtensionRequestService, protected loadingService: LoadingService, protected differs: KeyValueDiffers) {
        super(loadingService, differs);
        this.filter = new ExtensionFilter();

        // set filter dropdowns
        this.years = Lookups.YEARS;
        this.statuses = Lookups.EXTENSION_STATUSES;

        this.sortString = 'dueDate';
        this.sortOrder = 'desc';
    }

    ngOnInit(): void {
        this.resetCols();
        super.ngOnInit();
    }

    getTableData$(pageNumber: number, pageSize: number, sort: string, sortOrder: string): Observable<TableData<ExtensionRequest>> {
        this.page = pageNumber;
        this.pageSize = pageSize;

        if (sort) {
            this.sortString = sort;
            this.sortOrder = sortOrder;
        }
        
        return this.loadExtensions();
    }

    resetCols(): void {
        this.displayedColumns = [];

        this.displayedColumns.push('filerName');

        //if (this.showColumn("year"))
        //    this.displayedColumns.push('year');

        this.displayedColumns.push('daysRequested');
        this.displayedColumns.push('status');

        this.displayedColumns.push('createdTime');

        this.displayedColumns.push('dueDate');
    }

    dataChanged(): void {

    }

    public showColumn(col: string): boolean {
        return !this.hiddenCols.find(x => x == col)
    }

    public resetFilters(): void {
        this.filter = new ExtensionFilter();
        this.filterChange.emit(this.filter);
    }

    rowSelected(ext: ExtensionRequest): void {
        this.rowSelect.emit(ext);
    }

    isFiltered(): boolean {
        var result = false;

        if (this.filter) {
            if (this.filter.filerName != '')
                result = true;

            //if (this.filter.year != 0)
            //    result = true;

            if (this.filter.status != '' && this.filter.status != 'All')
                result = true;
        }

        return result;
    }

    loadExtensions(): Observable<TableData<ExtensionRequest>> {
        var filter = '';

        if (this.filter.filerName != '') {
            filter += 'filerName|' + this.filter.filerName + ';';
        }
        //if (this.filter.year != 0) {
        //    filter += 'year|' + this.filter.year + ';';
        //}
        if (this.filter.daysRequested != 0) {
            filter += 'daysRequested|' + this.filter.daysRequested + ';';
        }
        if (this.filter.status != '') {
            filter += 'status|' + this.filter.status + ';';
        }

        if (filter.endsWith(';'))
            filter = filter.substring(0, filter.length - 1);

        return this.extensionService.getTable(this.page, this.pageSize, this.sortString, this.sortOrder, filter);
    }

    search(): void {
        this.paginator.pageIndex = 0;
        this.filterChange.emit(this.filter);
    }

    public filterBy(type: string) {
        this.filter = new ExtensionFilter();

        switch (type.toLowerCase()) {
            case "pending":
                this.filter.status = ExtensionStatus.PENDING;
                break;
        }

        this.search();
    }
}
