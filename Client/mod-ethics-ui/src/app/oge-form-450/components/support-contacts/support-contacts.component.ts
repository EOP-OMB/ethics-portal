import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EthicsTeam } from '@shared/models/ethics-team.model';

@Component({
    selector: 'app-support-contacts',
    templateUrl: './support-contacts.component.html',
    styleUrls: ['./support-contacts.component.scss']
})
export class SupportContactsComponent implements OnInit, OnChanges {

    @Input()
    contacts: EthicsTeam[] = [];

    employees: EthicsTeam[] = [];

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        this.employees = this.contacts.filter(x => x.isUser);
    }

    ngOnInit(): void {
        
    }
}
