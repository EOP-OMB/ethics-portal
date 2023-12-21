import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-ethics-item',
    templateUrl: './ethics-item.component.html',
    styleUrls: ['./ethics-item.component.scss']
})
export class EthicsItemComponent implements OnInit {

    @Input()
    item: EthicsItem;

    @Output()
    select = new EventEmitter<any>();

    constructor() { }

    ngOnInit(): void {
    }

    onSelected(): void {
        this.select.emit(this.item);
    }
}

export class EthicsItem {

    icon: string;
    title: string;
    subtitle: string;
    details: string;
    type: string;
    obj: any;
    date: Date;
    status: string;
}
