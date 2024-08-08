import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import * as config from '@src/assets/menu-config.json';
import { ModSideMenuConfig } from 'mod-framework';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    public menuConfig: ModSideMenuConfig;

    constructor(private router: Router) {
        this.menuConfig = (config as any).default;

        this.router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe((e: any) => {
            var url = e.url;
            var prev = localStorage.getItem('goto');
            localStorage.setItem('prev', prev ? prev : '/');
            localStorage.setItem('goto', url);
        });
    }
}
