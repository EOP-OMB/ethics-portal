import { Component, OnInit, ViewChild } from '@angular/core';
import { Widget } from '@shared/models/widget.model';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Employee } from '@shared/models/employee.model';
import { CurrentUserService } from 'mod-framework';
import { Roles } from '@shared/static/roles.const';
import { TrainingTableComponent } from '@shared/components/training-table/training-table.component';
import { Training } from '@shared/models/training.model';
import { TrainingService } from '@shared/services/training.service';

@Component({
    selector: 'app-ethics-training-view',
    templateUrl: './ethics-training-view.component.html',
    styleUrls: ['./ethics-training-view.component.scss']
})
export class EthicsTrainingViewComponent implements OnInit {

    @ViewChild('dtTrainings') dtTrainings!: TrainingTableComponent;

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer;

    selectedTraining?: Training;

    trainings: Training[] = [];

    numberOfBlankForms: number = 0;
    numberOfUnchangedForms: number = 0;
    employee: Employee;
    filersWidget: Widget = new Widget();

    hiddenCols: string[] = [];

    constructor(private trainingService: TrainingService,
        protected userService: CurrentUserService,
        private router: Router) {
    }

    public get canEdit(): boolean {
        return this.userService.isInRole(Roles.Admin);
    }

    ngOnInit(): void {
        
    }

    onTrainingSelect(training: Training): void {
        this.trainingService.get(training.id).then(response => {
            this.selectedTraining = response;
            this.drawer.open();
        });
    }

    addTraining(): void {
        this.selectedTraining = new Training();
        this.drawer.open();
    }

    showDrawer(training: Training): void {
        this.selectedTraining = training;

        this.drawer.open();
    }

    drawerClosing(): void {
        this.selectedTraining = undefined;
    }

    gotoEmployee(employee: Employee): void {
        this.router.navigate(['/profile', employee.id]);
    }

    trainingClosed(training: Training) {
        if (training) {
            this.dtTrainings.refresh();
        }

        this.drawer.close()
    }

    canDelete(): boolean {
        return this.selectedTraining.id > 0 && this.userService.isInRole(Roles.Admin);
    }
}
