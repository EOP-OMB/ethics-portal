import { Component, OnInit, ViewChild } from '@angular/core';
import { Widget } from '@shared/models/widget.model';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { GuidanceService } from '@shared/services/guidance.service';
import { GuidanceTableComponent } from '@shared/components/guidance-table/guidance-table.component';
import { Guidance } from '@shared/models/guidance.model';
import { Employee } from '@shared/models/employee.model';
import { CurrentUserService } from 'mod-framework';
import { Roles } from '@shared/static/roles.const';

@Component({
    selector: 'app-guidance-view',
    templateUrl: './guidance-view.component.html',
    styleUrls: ['./guidance-view.component.scss']
})
export class GuidanceViewComponent implements OnInit {

    @ViewChild('dtGuidance') dtGuidance!: GuidanceTableComponent;

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer;

    selectedGuidance?: Guidance;

    guidance: Guidance[] = [];

    numberOfBlankForms: number = 0;
    numberOfUnchangedForms: number = 0;
    employee: Employee;
    filersWidget: Widget = new Widget();

    hiddenCols: string[] = [];

    constructor(private guidanceService: GuidanceService,
        protected userService: CurrentUserService,
        private router: Router) {
    }

    public get canEdit(): boolean {
        return this.userService.isInRole(Roles.Admin);
    }

    ngOnInit(): void {
        this.loadGuidance();
    }

    loadGuidance() {
        this.guidanceService
            .getAll()
            .then(guidance => {
                this.guidance = guidance;
            });
    }

    onFilersClick() {
        this.dtGuidance.resetFilters();
        this.dtGuidance.filter.filerType = "Not Assigned";
    }

    onGuidanceSelect(guidance: Guidance): void {
        this.guidanceService.get(guidance.id).then(response => {
            this.selectedGuidance = response;
            this.employee = response.employee;
            this.showDrawer(response);
        });
    }

    addGuidance(): void {
        this.selectedGuidance = new Guidance();
        this.drawer.open();
    }

    showDrawer(guidance: Guidance): void {
        this.selectedGuidance = guidance;

        this.drawer.open();
    }

    drawerClosing(): void {
        this.selectedGuidance = undefined;
    }

    saveGuidance(guidance: Guidance): void {
        this.guidanceService.save(guidance).then(response => {
            this.loadGuidance();
            this.drawer.close();
        });
    }

    gotoEmployee(employee: Employee): void {
        this.router.navigate(['/profile', employee.id]);
    }

    deleteGuidance(guidance: Guidance): void {
        this.guidanceService.delete(guidance.id).then(responst => {
            this.loadGuidance();
            this.drawer.close();
        });
    }
}
