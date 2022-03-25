import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { PropertyOptions } from 'mat-table-filter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { Lookups } from '@shared/static/lookups.static';
import { SelectItem } from '@shared/models/select-item.interface';
import { FormFilter } from '@shared/models/form-filter.model';
import { Helper } from '@shared/static/helper.funcs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LoadingService } from 'mod-framework';
import { TableBaseComponent } from '../table-base/table-base.component';
import { CachedTableComponent } from '../cached-table/cached-table.component';
import { Guidance } from '@shared/models/guidance.model';
import { GuidanceFilter } from '@shared/models/guidance-filter.model';
import { GuidanceTypeService } from '../../services/guidance-type.service';
import { GuidanceSubjectService } from '../../services/guidance-subject.service';

@Component({
    selector: 'app-guidance-table',
    templateUrl: './guidance-table.component.html',
    styleUrls: ['./guidance-table.component.scss']
})
export class GuidanceTableComponent extends CachedTableComponent<Guidance, GuidanceFilter> implements AfterViewInit {

    @Input()
    canAdd: boolean = false;

    @Output()
    addClicked = new EventEmitter();

    // Actions
    numberOfBlankForms: number = 0;
    numberOfUnchangedForms: number = 0;

    employeeTypes: SelectItem[];
    employeeSubtypes: SelectItem[];
    filerTypes: SelectItem[];
    guidanceTypes: SelectItem[];
    subjects: SelectItem[];

    constructor(protected loadingService: LoadingService,
        protected differs: KeyValueDiffers,
        private typeService: GuidanceTypeService,
        private subjectService: GuidanceSubjectService) {
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
    }

    ngAfterViewInit(): void {
        
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
