import { Component, Input, OnInit } from '@angular/core';
import { HelpfulLink } from '@oge450/models/helpful-link.model';

@Component({
  selector: 'app-helpful-links',
  templateUrl: './helpful-links.component.html',
  styleUrls: ['./helpful-links.component.scss']
})
export class HelpfulLinksComponent implements OnInit {
    @Input()
    links: HelpfulLink[] = [];

    constructor() { }

    ngOnInit(): void {
        
    }
}
