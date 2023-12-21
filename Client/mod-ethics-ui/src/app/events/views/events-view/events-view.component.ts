import { Component, OnInit, ViewChild } from '@angular/core';
import { EventRequestService } from '@shared/services/event-request.service';
import { Widget } from '@shared/models/widget.model';
import { EventRequestTableComponent } from '@shared/components/event-request-table/event-request-table.component';
import { EventRequestSummary } from '@shared/models/event-request-summary.model';
import { EventRequest } from '@shared/models/event-request.model';
import { MatDrawer } from '@angular/material/sidenav';
import { EmployeeListService } from '@shared/services/employee-list.service';
import { SelectItem } from '@shared/models/select-item.interface';

@Component({
    selector: 'app-events-view',
    templateUrl: './events-view.component.html',
    styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent implements OnInit {
    openWidget: Widget = new Widget();
    upcomingWidget: Widget = new Widget();
    assignedWidget: Widget = new Widget();

    @ViewChild('table') table: EventRequestTableComponent

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer

    reviewers: SelectItem[] = [];

    constructor(private eventService: EventRequestService, protected employeeListService: EmployeeListService) { }

    ngOnInit(): void {
        this.loadSummary();
        this.loadReviewers();
    }

    loadReviewers() {
        this.employeeListService.getEventReviewers()
            .then(response => {
                this.reviewers.push({ text: 'Not Assigned', value: "na", group: "" });

                response.forEach(emp => {
                    let item: SelectItem = {
                        text: emp.displayName,
                        value: emp.upn,
                        group: ""
                    };

                    this.reviewers.push(item);
                })
            });
    }

    loadSummary() {
        this.eventService.getSummary().then(response => {
            this.updateEventWidgets(response);
        });
    }

    drawerClosing(): void {
        
    }

    openClicked(): void {
        this.table.filterBy("open");
    }

    upcommingClicked(): void {
        this.table.filterBy("upcoming");
    }

    assignedClicked(): void {
        this.table.filterBy("assigned");
    }

    updateEventWidgets(summary: EventRequestSummary): void {
        this.openWidget.title = summary.openEvents.toString();
        this.openWidget.text = "Open Events";
        this.openWidget.actionText = "click to review";
        this.openWidget.color = 'success';
        
        this.upcomingWidget.title = summary.upcomingEvents.toString();
        this.upcomingWidget.text = "Upcoming Events";
        this.upcomingWidget.actionText = "click to review";
        this.upcomingWidget.color = summary.upcomingEvents == 0 ? 'success' : summary.upcomingEvents <= 10 ? 'warning' : 'danger';

        this.assignedWidget.title = summary.assignedToMe.toString();
        this.assignedWidget.text = "Assigned to Me";
        this.assignedWidget.actionText = "click to review";
        this.assignedWidget.color = summary.assignedToMe == 0 ? 'success' : summary.assignedToMe <= 10 ? 'info' : 'warning';
    }

    selectedEvent: EventRequest;

    showDrawer(event: EventRequest): void {
        this.selectedEvent = event;

        this.drawer.open();
    }

    onEventSelect(event: EventRequest): void {
        this.eventService.get(event.id).then(response => {
            this.showDrawer(response);
        });
    }

    eventSaved(e: EventRequest) {
        this.loadSummary();
        this.table.search();
    }
}
