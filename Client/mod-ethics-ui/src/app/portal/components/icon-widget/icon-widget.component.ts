import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-icon-widget',
    templateUrl: './icon-widget.component.html',
    styleUrls: ['./icon-widget.component.scss']
})
export class IconWidgetComponent implements OnInit {

    @Input()
    id: number = 0;

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

    @ViewChild('iconDiv', { static: true }) iconDiv: ElementRef | undefined;

    constructor() { }

    ngOnInit(): void {
        if (this.iconDiv)
            this.iconDiv.nativeElement.setAttribute('data-background-color', this.color);
    }

    public widgetClick(type: string, id: number): void {

    }

    public get danger(): string {
        return this.statusColor == "text-danger" ? "danger" : "";
    }
}
