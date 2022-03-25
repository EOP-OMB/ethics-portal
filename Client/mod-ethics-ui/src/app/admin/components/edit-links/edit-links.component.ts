import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HelpfulLink } from '@oge450/models/helpful-link.model';

@Component({
    selector: 'app-edit-links',
    templateUrl: './edit-links.component.html',
    styleUrls: ['./edit-links.component.scss']
})
export class EditLinksComponent implements OnInit, OnChanges {
    @Input()
    public links: HelpfulLink[] = [];

    @Output()
    save = new EventEmitter<HelpfulLink[]>();

    public newLinks: HelpfulLink[] = [];

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        this.newLinks = JSON.parse(JSON.stringify(this.links));
    }

    ngOnInit(): void {
       
    }

    isDirty(): boolean {
        return JSON.stringify(this.newLinks) != JSON.stringify(this.links);
    }

    addRow(): void {
        this.newLinks.push(new HelpfulLink());
    }

    saveLinks() {
        this.save.emit(this.newLinks);
    }
}
