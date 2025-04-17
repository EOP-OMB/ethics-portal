import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { Helper } from '@shared/static/helper.funcs';
import { LoadingService } from 'mod-framework';
import { Guidance } from '@shared/models/guidance.model';
import { GuidanceFilter } from '@shared/models/guidance-filter.model';
import { GuidanceTypeService } from '../../services/guidance-type.service';
import { GuidanceSubjectService } from '../../services/guidance-subject.service';
import { ServerSideTableComponent } from '../server-side-table/server-side-table.component';
import { GuidanceService } from '../../services/guidance.service';
import { Observable } from 'rxjs';
import { TableData } from '../../models/table-data.model';

@Component({
    selector: 'app-guidance-table',
    templateUrl: './guidance-table.component.html',
    styleUrls: ['./guidance-table.component.scss']
})
export class GuidanceTableComponent extends ServerSideTableComponent<Guidance, GuidanceFilter> implements OnInit {

    @Input()
    canAdd: boolean = false;

    @Output()
    addClicked = new EventEmitter();

    filter: GuidanceFilter;

    // Actions
    numberOfBlankForms: number = 0;
    numberOfUnchangedForms: number = 0;

    employeeTypes: SelectItem[];
    employeeSubtypes: SelectItem[];
    filerTypes: SelectItem[];
    guidanceTypes: SelectItem[];
    subjects: SelectItem[];

    page: number;
    pageSize: number;
    sortString: string;
    sortOrder: string;
    constructor(protected loadingService: LoadingService,
        protected differs: KeyValueDiffers,
        private typeService: GuidanceTypeService,
        private subjectService: GuidanceSubjectService,
        private service: GuidanceService)
    {
        super(loadingService, differs);

        this.filter = new GuidanceFilter();

        // set filter dropdowns
        this.employeeTypes = Lookups.EMPLOYEE_TYPES;
        this.employeeSubtypes = Lookups.EMPLOYEE_SUBTYPES;
        this.filerTypes = Lookups.FILER_TYPES;

        this.guidanceTypes = [];
        this.subjects = [];

        this.typeService.getAll().then(response => {
            response.forEach(x => {
                var si: SelectItem = { text: x.text, value: x.text, group: '' }
                this.guidanceTypes.push(si);
            })
        });

        this.subjectService.getAll().then(response => {
            response.forEach(x => {
                var si: SelectItem = { text: x.text, value: x.text, group: '' }
                this.subjects.push(si);
            })
        });
        

        this.propertyOptions = {
            dateOfGuidance: (date: string) => {
                let match = false;
                var days = Helper.getDaysSince(date);

                if (this.filter.dateOfGuidance == "week")
                    match = days <= 7;
                else if (this.filter.dateOfGuidance == "month")
                    match = days <= 30;
                else if (this.filter.dateOfGuidance == "year")
                    match = days <= 365;

                return match;
            }
        };

        this.sortString = 'dateOfGuidance';
        this.sortOrder = 'desc';
    }

    ngOnInit(): void {
        this.resetCols();
        super.ngOnInit();
    }

    getTableData$(page: number, pageSize: number, sort: string, sortOrder: string): Observable<TableData<Guidance>> {
        this.page = page;
        this.pageSize = pageSize;

        if (sort) {
            this.sortString = sort;
            this.sortOrder = sortOrder;
        }

        return this.loadGuidance();
    }

    loadGuidance() {
        var filter = '';

        if (this.filter.employeeName != '') {
            filter += 'employeeName|' + this.filter.employeeName + ';';
        }
        if (this.filter.filerType != '') {
            filter += 'filerType|' + this.filter.filerType + ';';
        }
        if (this.filter.summary != '') {
            filter += 'summary|' + this.filter.summary + ';';
        }
        if (this.filter.guidanceType != '') {
            filter += 'guidanceType|' + this.filter.guidanceType + ';';
        }
        if (this.filter.subject != '') {
            filter += 'subject|' + this.filter.subject + ';';
        }
        if (this.filter.dateFilter != '') {
            filter += 'dateFilter|' + this.filter.dateFilter + ';';
        }

        if (filter.endsWith(';'))
            filter = filter.substring(0, filter.length - 1);

        return this.service.getTable(this.page, this.pageSize, this.sortString, this.sortOrder, filter);
    }

    dataChanged(): void {
        
    }

    addGuidance(e: any) {
        this.addClicked.emit();
    }

    resetCols(): void {
        this.displayedColumns = [];
        this.showSelect = this.selectable;

        if (this.showSelect && !this.displayedColumns.find(x => x == "select"))
            this.displayedColumns.push('select');

        if (this.showColumn("employeeName"))
            this.displayedColumns.push('employeeName');
        if (this.showColumn("filerType"))
            this.displayedColumns.push('filerType');

        this.displayedColumns.push('summary');
        this.displayedColumns.push('guidanceType');
        this.displayedColumns.push('subject');
        this.displayedColumns.push('createdTime');
        this.displayedColumns.push('createdBy');
    }

    getHiddenExportCols() {
        var an = new Array<number>();
        var index = -1;

        index = this.getColumnIndex("select");
        if (index > 0)
            an.push(index);

        //index = this.getColumnIndex("formFlags");
        //if (index > 0)
        //    an.push(index);

        return an;
    }

    public resetFilters(): void {
        this.filter = new GuidanceFilter();
        this.filterChange.emit(this.filter);
        this.paginator.pageIndex = 0;
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

            if (this.filter.filerType != '' && this.filter.filerType != 'All')
                result = true;

            if (this.filter.guidanceType != '' && this.filter.guidanceType != 'All')
                result = true;

            if (this.filter.subject != '' && this.filter.subject != 'All')
                result = true;

            if (this.filter.dateOfGuidance != '')
                result = true;
        }

        return result;
    }
}
