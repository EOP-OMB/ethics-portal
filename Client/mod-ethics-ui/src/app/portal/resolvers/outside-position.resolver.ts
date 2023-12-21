import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { OutsidePositionService } from "@shared/services/outside-position.service";
import { OutsidePosition } from "@shared/models/outside-position.model";

@Injectable()
export class OutsidePositionResolver {
    constructor(private positionService: OutsidePositionService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<OutsidePosition | null> {
        let id = route.params['id'];

        if (id == 0) {
            var prom = new Promise<OutsidePosition>((resolve, reject) => {
                var position = new OutsidePosition();

                position.id = 0;

                if (position)
                    resolve(position);
                else
                    reject(null);
            });

            return prom;
        }
        else {
            return this.positionService.get(id).then(form => {
                if (form) {
                    return form;
                } else { // id not found
                    this.router.navigate(['/']);
                    return null;
                }
            });
        }
    }
}   
