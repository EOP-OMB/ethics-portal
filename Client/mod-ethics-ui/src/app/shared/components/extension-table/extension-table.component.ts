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

@Component({
    selector: 'app-extension-table',
    templateUrl: './extension-table.component.html',
    styleUrls: ['./extension-table.component.scss']
})
export class ExtensionTableComponent extends CachedTableComponent<ExtensionRequest, ExtensionFilter> implements AfterViewInit  {

    years: SelectItem[];
    statuses: SelectItem[];

    constructor(protected loadingService: LoadingService, protected differs: KeyValueDiffers) {
        super(loadingService, differs);
        this.filter = new ExtensionFilter();

        // set filter dropdowns
        this.years = Lookups.YEARS;
        this.statuses = Lookups.EXTENSION_STATUSES;
    }

    ngAfterViewInit(): void {
        if (!this.sort.active || this.sort.active == '')
            this.sort.sort(({ id: 'filerName', start: 'asc' }) as MatSortable);
    }

    resetCols(): void {
        this.displayedColumns = [];

        this.displayedColumns.push('filerName');

        if (this.showColumn("year"))
            this.displayedColumns.push('year');

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
    }

    rowSelected(ext: ExtensionRequest): void {
        this.rowSelect.emit(ext);
    }

    isFiltered(): boolean {
        var result = false;

        if (this.filter) {
            if (this.filter.filerName != '')
                result = true;

            if (this.filter.year != 0)
                result = true;

            if (this.filter.status != '' && this.filter.status != 'All')
                result = true;
        }

        return result;
    }

}
