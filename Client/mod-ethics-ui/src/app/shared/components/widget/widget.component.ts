import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Widget } from '@shared/models/widget.model';

@Component({
    selector: 'app-widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.scss'],
})

export class WidgetComponent implements OnInit {
    @Input() data: Widget = new Widget();
    @Input() icon: string = "";

    @Output()
    widgetClick: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {

    }

    onClick(): void {
        this.widgetClick.emit();
    }
}

