import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { SettingsService } from "./settings.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class MaintenanceGuard implements CanActivate {
    constructor(private router: Router, private settingsService: SettingsService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.settingsService.get().then(settings => {
            if (settings.inMaintMode)
                this.router.navigate(['/maintenance']);

            return !settings.inMaintMode;
        });
    }
}
