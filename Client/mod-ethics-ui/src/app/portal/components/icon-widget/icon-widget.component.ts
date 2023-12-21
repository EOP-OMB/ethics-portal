import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-icon-widget',
    templateUrl: './icon-widget.component.html',
    styleUrls: ['./icon-widget.component.scss']
})
export class IconWidgetComponent implements OnInit {
    @Input()
    title: string = "";

    @Input()
    icon: string = "";

    @Input()
    text: string = "";

    @Input()
    color: string = "";

    @Input()
    status: string = "";

    @Input()
    statusColor: string = "";

    @Input()
    actionIcon: string = "";

    @Input()
    actionText: string = "";

    @Output()
    widgetClick: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('iconDiv', { static: true }) iconDiv: ElementRef | undefined;

    constructor() { }

    ngOnInit(): void {
        if (this.iconDiv)
            this.iconDiv.nativeElement.setAttribute('data-background-color', this.color);
    }

    public onClick(): void {
        this.widgetClick.emit(this.title);
    }

    public get danger(): string {
        return this.statusColor == "text-danger" ? "danger" : "";
    }
}
