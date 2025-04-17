import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IDto, LoadingService } from 'mod-framework';
import { merge, Observable, ObservableInput, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TableData } from '../../models/table-data.model';
import { CachedTableComponent } from '../cached-table/cached-table.component';

@Component({
    selector: 'app-server-side-table',
    templateUrl: './server-side-table.component.html',
    styleUrls: ['./server-side-table.component.scss']
})
export abstract class ServerSideTableComponent<T extends IDto, TFilter> extends CachedTableComponent<T, TFilter> implements OnInit {
    @Input()
    pageSizeOptions: number[] = [5, 10, 20];

    totalData: number;

    page: number;
    pageSize: number;
    sortString: string;
    sortOrder: string;

    constructor(protected loadingService: LoadingService, protected differs: KeyValueDiffers) {
        super(loadingService, differs);
    }

    abstract getTableData$(pageNumber: number, pageSize: number, sort: string, sortOrder: string): Observable<TableData<T>>;

    filterChange = new EventEmitter<any>();

    ngOnInit() {
        this.resetCols();
    }

    ngAfterViewInit() {
        console.log('afterViewInit: server-side table component');
        merge(this.sort.sortChange, this.paginator.page, this.filterChange)
            .pipe(
                startWith({}),
                switchMap(() => {
                    var event = new PageEvent();
                    event.pageIndex = this.paginator.pageIndex;
                    event.pageSize = this.paginator.pageSize;
                    this.pageChanged(event);

                    var sort: Sort;
                    sort = this.sort;
                    sort.direction = this.sort.direction;
                    this.sortChanged(sort);

                    this.filterChanged(this.filter);

                    this.selection = new SelectionModel<T>(true, []);

                    return this.getTableData$(
                        this.paginator.pageIndex + 1,
                        this.paginator.pageSize,
                        this.sort.active,
                        this.sort.direction
                    ).pipe(catchError(() => of(null)));
                }),
                map((tableData) => {
                    if (tableData == null) return [];
                    this.totalData = tableData.total;
                    return tableData.data;
                })
            )
            .subscribe((data) => {
                this.data = data;
                this.dataSource = new MatTableDataSource(this.data);
            });
    }
}
