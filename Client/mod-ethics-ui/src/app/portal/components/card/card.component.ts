import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

    @Input()
    title: string = "";

    @Input()
    records: any[] = [];

    @Input()
    totalRecords: number = 0;

    @Input()
    options: any[] = [];

    @Input()
    showRecordDate: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    public gotoDetail(rec: any): void {

    }

    public showMore(): void {

    }

    public refresh(): void {

    }
}
