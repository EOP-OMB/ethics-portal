import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from 'mod-framework';
import { Employee } from '@shared/models/employee.model';
import { OutsidePosition } from '@shared/models/outside-position.model';
import { OutsidePositionsTableComponent } from '@shared/components/outside-positions-table/outside-positions-table.component';
import { MatDrawer } from '@angular/material/sidenav';
import { SelectItem } from '@shared/models/select-item.interface';
import { Widget } from '@shared/models/widget.model';
import { OutsidePositionService } from '@shared/services/outside-position.service';
import { OutsidePositionSummary } from '@shared/models/outside-position-summary.model';

@Component({
  selector: 'app-outside-positions-view',
  templateUrl: './outside-positions-view.component.html',
  styleUrls: ['./outside-positions-view.component.scss']
})
export class OutsidePositionsViewComponent {
    selectedPosition: OutsidePosition;

    @ViewChild('table') table: OutsidePositionsTableComponent

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer

    reviewers: SelectItem[] = [];

    constructor(protected userService: CurrentUserService,
        private positionService: OutsidePositionService,
        private router: Router) {
    }

    drawerClosing(): void {
        this.selectedPosition = undefined;
    }

    gotoEmployee(employee: Employee): void {
        this.router.navigate(['/profile', employee.id]);
    }

    managerWidget: Widget = new Widget();
    ethicsWidget: Widget = new Widget();
    assignedWidget: Widget = new Widget();

    ngOnInit(): void {
        this.loadSummary();
        //this.loadReviewers();
    }

    //loadReviewers() {
    //    this.employeeListService.getEventReviewers()
    //        .then(response => {
    //            this.reviewers.push({ text: 'Not Assigned', value: "na", group: "" });

    //            response.forEach(emp => {
    //                let item: SelectItem = {
    //                    text: emp.displayName,
    //                    value: emp.upn,
    //                    group: ""
    //                };

    //                this.reviewers.push(item);
    //            })
    //        });
    //}

    loadSummary() {
        this.positionService.getSummary().then(response => {
            this.updateWidgets(response);
        });
    }

    managerClicked(): void {
        this.table.filterBy("manager");
    }

    ethicsClicked(): void {
        this.table.filterBy("ethics");
    }

    assignedClicked(): void {
        this.table.filterBy("assigned");
    }

    updateWidgets(summary: OutsidePositionSummary): void {
        this.managerWidget.title = summary.awaitingManager.toString();
        this.managerWidget.text = "Awaiting Manager";
        this.managerWidget.actionText = "click to review";
        this.managerWidget.color = 'success';

        this.ethicsWidget.title = summary.awaitingEthics.toString();
        this.ethicsWidget.text = "Awaiting Ethics";
        this.ethicsWidget.actionText = "click to review";
        this.ethicsWidget.color = 'success';

        //this.upcomingWidget.title = summary.upcomingEvents.toString();
        //this.upcomingWidget.text = "Upcoming Events";
        //this.upcomingWidget.actionText = "click to review";
        //this.upcomingWidget.color = summary.upcomingEvents == 0 ? 'success' : summary.upcomingEvents <= 10 ? 'warning' : 'danger';

        this.assignedWidget.title = summary.assignedToMe.toString();
        this.assignedWidget.text = "Assigned to Me";
        this.assignedWidget.actionText = "click to review";
        this.assignedWidget.color = summary.assignedToMe == 0 ? 'success' : summary.assignedToMe <= 10 ? 'info' : 'warning';
    }

    showDrawer(position: OutsidePosition): void {
        this.selectedPosition = position;

        this.drawer.open();
    }

    onRowSelect(position: OutsidePosition): void {
        this.positionService.get(position.id).then(response => {
            this.showDrawer(response);
        });
    }

    positionSaved(e: OutsidePosition) {
        this.loadSummary();
        this.table.search();
    }

    addPosition() {
        this.router.navigate(["/position/0"]);
    }
}
