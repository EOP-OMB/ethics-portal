import { SelectionChange } from '@angular/cdk/collections';
import { Component, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSortable, Sort } from '@angular/material/sort';
import { IDto, LoadingService } from 'mod-framework';
import { StateHelper } from '../../static/state-helper.static';
import { TableBaseComponent } from '../table-base/table-base.component';

@Component({
    selector: 'app-cached-table',
    templateUrl: './cached-table.component.html',
    styleUrls: ['./cached-table.component.scss']
})
export abstract class CachedTableComponent<T extends IDto, TFilter> extends TableBaseComponent<T> implements OnInit, OnChanges {

    @Input()
    key: string = "";

    tableState: TableState = new TableState();

    public filter!: TFilter;
    private filterDiffer!: KeyValueDiffer<string, any>;

    constructor(protected loadingService: LoadingService, protected differs: KeyValueDiffers) {
        super(loadingService);      
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.paginator.page.subscribe(event => this.pageChanged(event));
        this.sort.sortChange.subscribe(event => this.sortChanged(event));
        this.selection.changed.subscribe(event => this.selectionChanged(event));
    }

    ngDoCheck(): void {
        if (this.filterDiffer && this.filter) {
            const changes = this.filterDiffer.diff(this.filter);
            if (changes) {
                this.filterChanged(this.filter);
            }
        }
    }

    ngOnChanges(change: SimpleChanges): void {
        super.ngOnChanges(change);

        if (change.key && change.key.currentValue) {
            var obj = StateHelper.loadState(this.key);
            if (obj) {
                this.tableState = obj;
            }
            if (this.tableState.sortDirection != "")
                this.sort.sort(({ id: this.tableState.sort, start: this.tableState.sortDirection }) as MatSortable);

            this.paginator.pageSize = this.tableState.pageSize;

            //setTimeout(() => {
                this.paginator.pageIndex = this.tableState.pageIndex;
            //});

            if (this.tableState.filter) {
                this.filter = this.tableState.filter as TFilter;
            }

            this.filterDiffer = this.differs.find(this.filter).create();
        }
    }

    //oppositeDirection(dir: string): string {
    //    return dir == "" ? "asc" : (dir == "asc" ?  "desc" : "asc");
    //}

    pageChanged(event: PageEvent): void {
        this.tableState.pageIndex = event.pageIndex;
        this.tableState.pageSize = event.pageSize;
       
        StateHelper.saveState(this.key, this.tableState);
    }

    sortChanged(event: Sort): void {
        this.tableState.sort = event.active;
        this.tableState.sortDirection = event.direction;
        StateHelper.saveState(this.key, this.tableState);
    }

    selectionChanged(event: SelectionChange<T>): void {
        
    }

    filterChanged(filter: TFilter): void {
        this.tableState.filter = filter;
        StateHelper.saveState(this.key, this.tableState);
    }
}

export class TableState {
    pageIndex: number = 0;
    pageSize: number = 0;
    sort: string = "";
    sortDirection: string = "asc";  // 'asc' or 'desc'
    filter: any;
    data: any[] = [];
}
