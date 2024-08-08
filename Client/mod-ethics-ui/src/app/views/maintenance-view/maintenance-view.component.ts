import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@shared/services/settings.service';

@Component({
  selector: 'app-maintenance-view',
  templateUrl: './maintenance-view.component.html',
  styleUrls: ['./maintenance-view.component.scss']
})
export class MaintenanceViewComponent {

    ngOnInit(): void {
        this.verifyMaintMode();
    }

    constructor(
        private settingsService: SettingsService,
        private router: Router) { }

    verifyMaintMode(): void {
        this.settingsService.get().then(response => {
            if (!response.inMaintMode)
                this.router.navigate(['/home']);
        });
    }

    public retry() {
        this.verifyMaintMode();
    }
}
