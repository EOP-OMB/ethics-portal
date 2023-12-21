import { Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { CurrentUserService, LoadingService } from 'mod-framework';
import { Observable } from 'rxjs';
import { Employee } from '@shared/models/employee.model';
import { OutsidePosition } from '@shared/models/outside-position.model';
import { SelectItem } from '@shared/models/select-item.interface';
import { TableData } from '@shared/models/table-data.model';
import { OutsidePositionService } from '@shared/services/outside-position.service';
import { EventStatus } from '@shared/static/event-status.const';
import { Lookups } from '@shared/static/lookups.static';
import { ServerSideTableComponent } from '@shared/components/server-side-table/server-side-table.component';
import { OutsidePositionStatuses } from '@shared/static/outside-position-statuses.const';

@Component({
    selector: 'app-outside-positions-table',
    templateUrl: './outside-positions-table.component.html',
    styleUrls: ['./outside-positions-table.component.scss']
})
export class OutsidePositionsTableComponent extends ServerSideTableComponent<OutsidePosition, OutsidePosition> implements OnInit {
    positionStatuses: SelectItem[] = Lookups.OUTSIDE_POSITION_STATUSES;

    @Input()
    reviewers: SelectItem[] = [];

    @Output()
    addClicked = new EventEmitter();

    filter: OutsidePosition = new OutsidePosition();;

    get isFiltered(): boolean {
        var filtered = false;

        if (this.filter.employeeName != '')
            filtered = true;
        if (this.filter.positionTitle != '')
            filtered = true;
        if (this.filter.status != '')
            filtered = true;
        if (this.filter.supervisorUpn != '')
            filtered = true;
        if (this.filter.organizationName != '')
            filtered = true;

        return filtered;
    }

    page: number;
    pageSize: number;
    sortString: string;
    sortOrder: string;

    constructor(private service: OutsidePositionService,
        private userService: CurrentUserService,
        protected loadingService: LoadingService,
        protected differs: KeyValueDiffers) {
        super(loadingService, differs);

        this.sortString = 'submittedDate';
        this.sortOrder = 'desc';
    }

    ngOnInit(): void {
        this.resetCols();
        super.ngOnInit();
    }

    getTableData$(page: number, pageSize: number, sort: string, sortOrder: string): Observable<TableData<OutsidePosition>> {
        this.page = page;
        this.pageSize = pageSize;

        if (sort) {
            this.sortString = sort;
            this.sortOrder = sortOrder;
        }

        return this.loadPositions();
    }

    resetCols(): void {
        this.displayedColumns = [
            'employeeName',
            'positionTitle',
            'organizationName',
            'startDate',
            'submittedDate',
            'status',
            'nextApprover'
        ];
    }


    dataChanged(): void {

    }

    getFilter() {
        var filter = '';

        if (this.filter.employeeName) {
            filter += 'employeeName|' + this.filter.employeeName + ';';
        }
        if (this.filter.positionTitle) {
            filter += 'positionTitle|' + this.filter.positionTitle + ';';
        }
        if (this.filter.status) {
            filter += 'status|' + this.filter.status + ';';
        }
        if (this.filter.supervisorUpn) {
            filter += 'nextApprover|' + this.filter.supervisorUpn + ';';
        }
        if (this.filter.organizationName) {
            filter += 'organizationName|' + this.filter.organizationName + ';';
        }
        if (filter.endsWith(';'))
            filter = filter.substring(0, filter.length - 1);

        return filter;
    }

    loadPositions() {
        var filter = this.getFilter();

        return this.service.getTable(this.page, this.pageSize, this.sortString, this.sortOrder, filter);
    }

    resetFilters(): void {
        this.filter = new OutsidePosition();
        this.filterChange.emit(this.filter);
    }

    search(): void {
        this.paginator.pageIndex = 0;
        this.filterChange.emit(this.filter);
    }

    public filterBy(type: string) {
        this.filter = new OutsidePosition();

        switch (type.toLowerCase()) {
            case "manager":
                this.filter.status = OutsidePositionStatuses.AWAITING_MANAGER;
                break;
            case "ethics":
                this.filter.status = OutsidePositionStatuses.AWAITING_ETHICS;
                break;
            //case "upcoming":
            //    this.filter.status = EventStatus.OPEN;
            //    this.filter.dateFilter = "next7";
            //    break;
            case "assigned":
                this.filter.supervisorUpn = this.userService.user.upn;
                break;
        }

        this.search();
    }

    addPosition(e: any) {
        this.addClicked.emit();
    }

    exportData: OutsidePosition[];

    public exportClick(): void {
        var filter = this.getFilter();

        this.loadingService.isLoading.next(true);

        this.service.getTable(1, this.totalData, this.sortString, this.sortOrder, filter).subscribe(response => {
            this.exportData = response.data;
        });
    }
}
