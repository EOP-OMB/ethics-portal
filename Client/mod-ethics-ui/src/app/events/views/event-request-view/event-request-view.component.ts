import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventRequest } from '@shared/models/event-request.model';

@Component({
    selector: 'app-event-request-view',
    templateUrl: './event-request-view.component.html',
    styleUrls: ['./event-request-view.component.scss']
})
export class EventRequestViewComponent implements OnInit {
    request: EventRequest;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.data.subscribe((data: { request: EventRequest }) => {
            this.request = data.request;
            localStorage.setItem('dirtyOvervide', "0");
            localStorage.setItem('goto', '');
        });
    }

}
