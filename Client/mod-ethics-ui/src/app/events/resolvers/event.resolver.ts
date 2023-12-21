import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { EventRequest } from "@shared/models/event-request.model";
import { EventRequestService } from "@shared/services/event-request.service";

@Injectable()
export class EventResolver  {
    constructor(private eventService: EventRequestService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<EventRequest | null> {
        let id = route.params['id'];

        if (id == 0) {
            var prom = new Promise<EventRequest>((resolve, reject) => {
                var event = new EventRequest();

                event.id = 0;

                if (event)
                    resolve(event);
                else
                    reject(null);
            });

            return prom;
        }
        else {
            return this.eventService.get(id).then(form => {
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
