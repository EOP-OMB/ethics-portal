import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { PropertyOptions } from 'mat-table-filter';
import { IDto, LoadingService } from 'mod-framework';

@Component({
    selector: 'app-table-base',
    templateUrl: './table-base.component.html',
    styleUrls: ['./table-base.component.scss']
})
export abstract class TableBaseComponent<T extends IDto> implements OnInit, OnChanges {

    @Input()
    data: T[] = [];

    @Input()
    hiddenCols: string[] = [];

    @Input()
    selectable: boolean = false;

    @Output()
    rowSelect = new EventEmitter<T>();

    public propertyOptions: PropertyOptions = {};
    public displayedColumns: string[] = [];

    public dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
    public selection = new SelectionModel<T>(true, []);

    public showSelect: boolean = false;

    @ViewChild(MatPaginator, { static: true })
    public paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true })
    public sort!: MatSort;

    @ViewChild(MatTableExporterDirective, { static: false })
    exporter!: MatTableExporterDirective;

    public isExporting: boolean = false;

    constructor(protected loadingService: LoadingService) { }

    ngOnInit(): void {
        this.dataSource.sortingDataAccessor = (data, sortHeaderId) => this.sortingDataAccesor(data, sortHeaderId);

    }

    sortingDataAccesor(obj: any, sortHeaderId: string): string | number {
        var prop = obj[sortHeaderId];

        if (typeof prop === 'string' || prop instanceof String)
            return prop.toLocaleLowerCase();
        if (typeof prop === 'number')
            return (prop as number);

        return prop;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue) {
            this.resetCols();
            this.initializeDataSource();
            this.dataChanged();
        }   
    }

    public initializeDataSource() {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public getColumnIndex(col: string) {
        return this.displayedColumns.indexOf(col);
    }

    abstract resetCols(): void;

    abstract dataChanged(): void;

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.filteredData.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataSource.filteredData);
    }

    /** The label for the checkbox on the passed row */
    public checkboxLabel(row?: T): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
    }

    public showColumn(col: string): boolean {
        return !this.hiddenCols.find(x => x == col)
    }

    public rowSelected(data: T): void {
        this.rowSelect.emit(data);
    }

    public exportToExcel(name: string = "EthicsExport") {
        var options: any = {
            fileName: name
        };

        this.exporter.exportTable('xlsx', options)
    }

    public exporting(start: boolean) {
        this.isExporting = start;
        this.loadingService.isLoading.next(start);
    }

}
