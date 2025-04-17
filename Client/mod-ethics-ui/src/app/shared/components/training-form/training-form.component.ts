import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '@shared/models/employee.model';
import { TrainingService } from '@shared/services/training.service';
import { CurrentUserService } from 'mod-framework';
import { Training } from '@shared/models/training.model';
import { Roles } from '@shared/static/roles.const';
import { TrainingTypes } from '@shared/static/training-types.const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Attendee } from '../../models/attendee.model';
import { PeoplePickerComponent } from '../people-picker/people-picker.component';


@Component({
    selector: 'app-training-form',
    templateUrl: './training-form.component.html',
    styleUrls: ['./training-form.component.scss']
})
export class TrainingFormComponent implements OnInit {
    @Input()
    mode: string = 'SELF';

    @Input()
    myTraining: Training[];

    @Input()
    training: Training;

    @Input()
    canDelete: boolean = false;

    @Output()
    close = new EventEmitter<Training>();

    @ViewChild('peoplePicker')
    peoplePicker: PeoplePickerComponent;

    certForm: FormGroup;
    today: Date = new Date();

    initialTraining: Training;
    currentAnnual: Training;
    lastAnnual: Training;

    submitting: boolean = false;
    hasError: boolean = false;

    get id() { return this.certForm.get('id'); }
    get trainingType() { return this.certForm.get('trainingType'); }
    get trainingDate() { return this.certForm.get('trainingDate'); }
    get location() { return this.certForm.get('location'); }
    get ethicsOfficial() { return this.certForm.get('ethicsOfficial'); }
    get attendees() { return this.certForm.get("attendees") as FormArray }
    get showUser() { return this.userService.user.upn != this.training.employeeUpn }

    get year() {
        if (this.trainingDate.value) {
            var date = new Date(this.trainingDate.value);

            return date.getFullYear();
        }
        else
            return new Date().getFullYear();
    }

    get canEdit() {
        return this.userService.isInRole(Roles.Admin) || this.userService.isInRole(Roles.Support) || this.userService.user.upn.toLowerCase() == this.training.employeeUpn.toLowerCase();
    }

    constructor(private formBuilder: FormBuilder,
        private trainingService: TrainingService,
        private userService: CurrentUserService,
        private snackBar: MatSnackBar) {

        this.certForm = this.formBuilder.group({
            id: [0, Validators.required],
            trainingType: ['', [Validators.required]],
            trainingDate: [null, [Validators.required]],
            location: ['', [Validators.required]],
            ethicsOfficial: [null, [Validators.required]],
            attendees: this.formBuilder.array([], (this.mode != "SELF" && this.canAssignAttendees()) ? Validators.required : [])
        });
    }

    ngOnInit(): void {
        this.initializeTraining(this.training);
    }

    initializeTraining(training: Training): void {
        if (training) {
            this.certForm = this.formBuilder.group({
                id: [training.id, Validators.required],
                trainingType: [training.trainingType, [Validators.required]],
                trainingDate: [training.trainingDate, [Validators.required]],
                location: [training.location, [Validators.required]],
                ethicsOfficial: [training.ethicsOfficial, [Validators.required]],
                attendees: this.formBuilder.array([], (this.canAssignAttendees() && this.mode == "MANAGE") ? Validators.required : [])
            });
        }
    }

    ngOnChanges(): void {
        if (this.myTraining) {
            var tmpList = this.myTraining.filter(x => x.trainingType == TrainingTypes.INITIAL);
            if (tmpList) {
                this.initialTraining = tmpList[0];
            }

            tmpList = this.myTraining.filter(x => x.trainingType == TrainingTypes.ANNUAL && x.year == this.today.getFullYear());
            if (tmpList) {
                this.currentAnnual = tmpList[0];
            }

            tmpList = this.myTraining.filter(x => x.trainingType == TrainingTypes.ANNUAL);
            if (tmpList) {
                tmpList = tmpList.sort((a, b) => a.trainingDate < b.trainingDate ? 1 : 0);
                this.lastAnnual = tmpList[0];
            }
        }
    }

    trainingTypeSelected(type: string) {
        var training: Training;

        if (type == TrainingTypes.INITIAL)
            training = this.initialTraining;
        else
            training = this.currentAnnual;

        if (!training) {
            training = new Training();
            training.trainingType = type;
        }

        this.initializeTraining(training);
    }

    employeeSelected(employee: Employee) {
        this.attendees.push(this.newAttendee(employee));
        this.peoplePicker.clearSelected();
    }

    newAttendee(employee: Employee): FormGroup {
        return this.formBuilder.group({
            employeeName: employee.displayName,
            employeeUpn: employee.upn
        });
    }

    removeAttendee(i: number) {
        this.attendees.removeAt(i);
    }

    canAssignAttendees(): boolean {
        return this.userService.isInRole(Roles.Admin) && this.id.value == 0;
    }

    onSubmit(): void {
        if (this.certForm.valid) {
            this.submitting = true;
            let training = Object.assign(new Training, this.certForm.value);
            training.year = this.year;
            training.attendees = undefined;

            let attendees = [];

            if (this.canAssignAttendees())
                attendees = Object.assign([], this.attendees.value);

            let promises = [];

            if (attendees.length > 0) {

                attendees.forEach(att => {
                    training.employeeName = att.employeeName;
                    training.employeeUpn = att.employeeUpn;

                    promises.push(this.trainingService.save(training).then(response => {
                        att.result = "Success";
                    }).catch(x => {
                        att.result = "Error";
                        this.hasError = true;
                    }));
                });

                Promise.allSettled(promises).then(results => {
                    var success = true;
                    
                    attendees.forEach(att => {
                        if (att.result == "Error")
                            success = false;
                    });

                    if (success) {
                        this.onSubmitted(training);
                    }
                });
            }
            else {
                training.employeeName = this.userService.user.displayName;
                training.employeeUpn = this.userService.user.upn.toLowerCase();

                this.trainingService.save(training).then(response => {
                    this.onSubmitted(response);
                });
            }
        }
    }

    onSubmitted(training: Training) {
        this.showSnackbar("Save completed");
        this.close.emit(training);
    }

    showSnackbar(msg: string) {
        this.snackBar.open(msg, '', { duration: 4000 });
    }

    cancelClick(): void {
        if (this.training) {
            this.close.emit(null);
        }
        else {
            this.trainingType.setValue('');
        }
    }

    deleteTraining(): void {
        if (confirm("You are about to delete this training, are you sure you want to continue?")) {
            this.trainingService.delete(this.training.id);
            this.showSnackbar("Training Deleted");
            this.close.emit(this.training);
        }
    }
}
