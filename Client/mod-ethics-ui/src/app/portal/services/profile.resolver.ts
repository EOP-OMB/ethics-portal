import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Employee } from "@shared/models/employee.model";
import { EmployeeService } from "@shared/services/employee.service";
import { CurrentUserService } from "mod-framework";

@Injectable()
export class ProfileResolver  {
    constructor(private employeeService: EmployeeService,
            private userService: CurrentUserService,
            private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Employee | null> {
        let id = route.params['id'];

        if (id) {
            return this.employeeService.get(id).then(emp => {
                if (emp.id == id) {
                    return emp;
                } else { // id not found
                    this.router.navigate(['/']);
                    return null;
                }
            });
        }
        else {
            return this.employeeService.getMyProfile().then(emp => {
                if (emp && emp.id > 0) {
                    return emp;
                } else { // id not found
                    this.router.navigate(['/']);
                    return null;
                }
            });
        }
    }
}
