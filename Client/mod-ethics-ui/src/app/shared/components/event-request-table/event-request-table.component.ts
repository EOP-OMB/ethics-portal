import { Component, Input, KeyValueDiffers, OnInit } from '@angular/core';
import { CurrentUserService, LoadingService } from 'mod-framework';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { EventRequest } from '../../models/event-request.model';
import { SelectItem } from '../../models/select-item.interface';
import { TableData } from '../../models/table-data.model';
import { EventRequestService } from '../../services/event-request.service';
import { EventStatus } from '../../static/event-status.const';
import { Lookups } from '../../static/lookups.static';
import { ServerSideTableComponent } from '../server-side-table/server-side-table.component';

@Component({
    selector: 'app-event-request-table',
    templateUrl: './event-request-table.component.html',
    styleUrls: ['./event-request-table.component.scss']
})
export class EventRequestTableComponent extends ServerSideTableComponent<EventRequest, EventRequest> implements OnInit {
    eventStatuses: SelectItem[] = Lookups.EVENT_STATUSES;

    @Input()
    reviewers: SelectItem[] = [];

    filter: EventRequest;

    get isFiltered(): boolean {
        var filtered = false;

        if (this.filter.attendeesString != '')
            filtered = filtered || true;
        if (this.filter.eventName != '')
            filtered = filtered || true;
        if (this.filter.status != '')
            filtered = filtered || true;
        if (this.filter.dateFilter != '')
            filtered = filtered || true;
        if (this.filter.assignedToUpn != '')
            filtered = filtered || true;
        
        return filtered;
    }

    page: number;
    pageSize: number;
    sortString: string;
    sortOrder: string;

    constructor(private service: EventRequestService,
                private userService: CurrentUserService,
                protected loadingService: LoadingService,
                protected differs: KeyValueDiffers) {
        super(loadingService, differs);

        this.filter = new EventRequest();

        this.sortString = 'eventDates';
        this.sortOrder = 'desc';
    }

    ngOnInit(): void {
        this.resetCols();
        super.ngOnInit();
    }

    getTableData$(page: number, pageSize: number, sort: string, sortOrder: string): Observable<TableData<EventRequest>> {
        this.page = page;
        this.pageSize = pageSize;
        
        if (sort) {
            this.sortString = sort;
            this.sortOrder = sortOrder;
        }

        return this.loadEvents();
    }

    resetCols(): void {
        this.displayedColumns = [
            'attendeesString',
            'eventName',
            'eventDates',
            'submittedDate',
            'status',
            'assignedTo'
        ];
    }


    dataChanged(): void {
        
    }

    loadEvents() {
        var filter = '';

        if (this.filter.eventName != '') {
            filter += 'eventName|' + this.filter.eventName + ';';
        }
        if (this.filter.dateFilter != '') {
            filter += 'dateFilter|' + this.filter.dateFilter + ';';
        }
        if (this.filter.attendeesString != '') {
            filter += 'attendeesString|' + this.filter.attendeesString + ';';
        }
        if (this.filter.assignedToUpn != '') {
            filter += 'assignedToUpn|' + this.filter.assignedToUpn + ';';
        }
        if (this.filter.status != '') {
            filter += 'status|' + this.filter.status + ';';
        }

        if (filter.endsWith(';'))
            filter = filter.substring(0, filter.length - 1);

        return this.service.getTable(this.page, this.pageSize, this.sortString, this.sortOrder, filter);
    }

    resetFilters(): void {
        this.filter = new EventRequest();
        this.filterChange.emit(this.filter);
    }

    search(): void {
        this.paginator.pageIndex = 0;
        this.filterChange.emit(this.filter);
    }

    public filterBy(type: string) {
        this.filter = new EventRequest();

        switch (type.toLowerCase()) {
            case "open":
                this.filter.status = EventStatus.OPEN;
                break;
            case "upcoming":
                this.filter.status = EventStatus.OPEN;
                this.filter.dateFilter = "next7";
                break;
            case "assigned":
                this.filter.assignedToUpn = this.userService.user.upn;
                break;
        }

        this.search();
    }
}
