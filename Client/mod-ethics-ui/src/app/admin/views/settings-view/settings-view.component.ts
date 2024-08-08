import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from '@shared/models/settings.model';
import { SettingsService } from '@shared/services/settings.service';
import { HelpfulLinksService } from '@oge450/services/helpful-link.service';
import { HelpfulLink } from '@oge450/models/helpful-link.model';

@Component({
    selector: 'app-settings-view',
    templateUrl: './settings-view.component.html',
    styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit {

    public settings: Settings = new Settings();
    public links: HelpfulLink[] = [];

    constructor(private settingsService: SettingsService,
                private linkService: HelpfulLinksService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.getSettings();
        this.getLinks();
    }

    getSettings(): void {
        this.settingsService
            .get()
            .then(response => {
                this.settings = response;
            });
    }

    getLinks(): void {
        this.linkService
            .getAll()
            .then(response => {
                this.links = response;
            });
    }

    saveLinks(links: HelpfulLink[]) {
        var count = links.length;
        var saveCount = 0;

        links.forEach(link => {
            saveCount++;

            if (link.url == "")
                this.linkService.delete(link.id).then(() => {
                    this.checkSaveDone(saveCount, count);
                });
            else
                this.linkService
                    .save(link)
                    .then(() => {
                        this.checkSaveDone(saveCount, count);
                });
        });
    }

    checkSaveDone(saved: number, total: number) {
        if (saved == total)
            this.getLinks();
    }

    saveSettings(settings: Settings) {
        this.settingsService.update(settings).then(response => {
            this.settings = response;

            $("#settings-success").alert();

            $("#settings-success").fadeTo(2000, 500).slideUp(500, function () {
                $("#settings-success").slideUp(500);
            });
        });
    }

    initiateAnnualRollover() {
        this.settingsService.initiateAnnualRollover().then(response => {
            this.settings = response;

            this.router.navigate(['/portal/maintenance']);
        });
    }
}
