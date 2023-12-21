import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { OutsidePosition } from '../../models/outside-position.model';
import { Router } from '@angular/router';
import { CurrentUserService } from 'mod-framework';
import { Roles } from '../../static/roles.const';

@Component({
    selector: 'app-outside-position-detail',
    templateUrl: './outside-position-detail.component.html',
    styleUrls: ['./outside-position-detail.component.scss']
})
export class OutsidePositionDetailComponent {
    @Input()
    position: OutsidePosition;

    @Output()
    employeeClick = new EventEmitter<Employee>();

    @Output()
    close = new EventEmitter<any>();

    constructor(protected router: Router, protected userService: CurrentUserService) {

    }

    view() {
        this.router.navigate(["/position/" + this.position.id]);
    }

    canEdit(): boolean {
        return this.userService.isInRole(Roles.Admin) || this.userService.isInRole(Roles.Support) || this.position.employeeUpn.toLowerCase() == this.userService.user.upn.toLowerCase() || this.position.supervisorUpn.toLowerCase() == this.userService.user.upn.toLowerCase();
    }

    displayedColumns: string[] = ['createdTime', 'createdByName', 'action', 'comment', 'status'];
}
