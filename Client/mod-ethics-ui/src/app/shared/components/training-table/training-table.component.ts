import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { LoadingService } from 'mod-framework';
import { Observable } from 'rxjs';
import { SelectItem } from '../../models/select-item.interface';
import { TableData } from '../../models/table-data.model';
import { Training } from '../../models/training.model';
import { TrainingService } from '../../services/training.service';
import { Lookups } from '../../static/lookups.static';
import { ServerSideTableComponent } from '../server-side-table/server-side-table.component';

@Component({
  selector: 'app-training-table',
  templateUrl: './training-table.component.html',
  styleUrls: ['./training-table.component.scss']
})
export class TrainingTableComponent extends ServerSideTableComponent<Training, Training> implements OnInit {
    @Input()
    canAdd: boolean = false;

    @Output()
    addClicked = new EventEmitter();

    trainingTypes: SelectItem[];
    years: SelectItem[];

    page: number;
    pageSize: number;
    sortString: string;
    sortOrder: string;
    constructor(
        private service: TrainingService,
        protected loadingService: LoadingService,
        protected differs: KeyValueDiffers) {
        super(loadingService, differs);

        this.filter = new Training();

        // set filter dropdowns
        this.trainingTypes = Lookups.TRAINING_TYPES;
        this.years = Lookups.YEARS;

        this.sortString = 'trainingDate';
        this.sortOrder = 'desc';
    }

    ngOnInit(): void {
        this.resetCols();
        super.ngOnInit();
    }

    dataChanged(): void {

    }

    addTraining(e: any) {
        this.addClicked.emit();
    }

    getTableData$(page: number, pageSize: number, sort: string, sortOrder: string): Observable<TableData<Training>> {
        this.page = page;
        this.pageSize = pageSize;

        if (sort) {
            this.sortString = sort;
            this.sortOrder = sortOrder;
        }

        return this.loadTraining();
    }

    resetCols(): void {
        this.displayedColumns = [];
        this.showSelect = this.selectable;

        if (this.showSelect && !this.displayedColumns.find(x => x == "select"))
            this.displayedColumns.push('select');

        this.displayedColumns.push('employeeName');
        this.displayedColumns.push('employeeStatus');
        this.displayedColumns.push('year');
        this.displayedColumns.push('trainingType');
        this.displayedColumns.push('ethicsOfficial');
        this.displayedColumns.push('location');
        this.displayedColumns.push('trainingDate');
    }

    loadTraining() {
        var filter = this.getFilter();

        return this.service.getTable(this.page, this.pageSize, this.sortString, this.sortOrder, filter);
    }

    getFilter(): string {
        var filter: string = '';

        if (this.filter.employeeName != '') {
            filter += 'employeeName|' + this.filter.employeeName + ';';
        }
        if (this.filter.year && this.filter.year > 0) {
            filter += 'year|' + this.filter.year.toString() + ';';
        }
        if (this.filter.trainingType != '') {
            filter += 'trainingType|' + this.filter.trainingType + ';';
        }
        if (this.filter.ethicsOfficial != '') {
            filter += 'ethicsOfficial|' + this.filter.ethicsOfficial + ';';
        }
        if (this.filter.location != '') {
            filter += 'location|' + this.filter.location + ';';
        }
        if (this.filter.employeeStatus != '') {
            filter += 'employeeStatus|' + this.filter.employeeStatus + ';';
        }

        if (filter.endsWith(';'))
            filter = filter.substring(0, filter.length - 1);

        return filter;
    }

    public resetFilters(): void {
        this.filter = new Training();
        this.search();
    }

    refresh() {
        this.filterChange.emit(this.filter);
    }

    search(): void {
        this.paginator.pageIndex = 0;
        this.filterChange.emit(this.filter);
    }

    isFiltered(): boolean {
        var result = false;

        if (this.filter) {
            if (this.filter.employeeName != '')
                result = true;

            if (this.filter.year || this.filter.year > 0)
                result = true;

            if (this.filter.trainingType != '')
                result = true;

            if (this.filter.ethicsOfficial != '')
                result = true;

            if (this.filter.location != '')
                result = true;

            if (this.filter.employeeStatus != '')
                result = true;
        }

        return result;
    }

    exportData: Training[];

    public exportClick(): void {
        var filter = this.getFilter();

        this.loadingService.isLoading.next(true);

        this.service.getTable(1, this.totalData, this.sortString, this.sortOrder, filter).subscribe(response => {
            this.exportData = response.data;
        });
    }
}
