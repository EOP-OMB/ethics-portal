import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { OgeForm450 } from "../../shared/models/oge-form-450.model";
import { OGEForm450Service } from "../../shared/services/oge-form-450.service";

@Injectable()
export class OGEForm450Resolver implements Resolve<OgeForm450 | null> {
    constructor(private formService: OGEForm450Service, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<OgeForm450 | null>  {
        let id = route.params['id'];

        if (id) {
            return this.formService.get(id).then(form => {
                if (form.id == id) {
                    return form;
                } else { // id not found
                    this.router.navigate(['/']);
                    return null;
                }
            });
        }
        else {
            return this.formService.getCurrentForm().then(form => {
                if (form && form.id > 0) {
                    return form;
                } else { // id not found
                    this.router.navigate(['/']);
                    return null;
                }
            });
        }
    }
}   
