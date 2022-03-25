import { Component, OnInit, ViewChild } from '@angular/core';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { Settings } from '@shared/models/settings.model';
import { FormComponent } from '@oge450/components/form/form.component';
import { CurrentUserService } from 'mod-framework';
import { SettingsService } from '@shared/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OGEForm450Service } from '@shared/services/oge-form-450.service';
import { FormStatus } from '@app/shared/static/form-status.const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Roles } from '@shared/static/roles.const';

@Component({
    selector: 'app-form-view',
    templateUrl: './form-view.component.html',
    styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent implements OnInit {

    form: OgeForm450 = new OgeForm450();
    prevForm: OgeForm450 | null = null;
    settings: Settings = new Settings();
    mode: string = "EDIT";

    @ViewChild('ogeForm450')
    ogeForm450?: FormComponent

    constructor(
        private userService: CurrentUserService,
        private settingsService: SettingsService,
        private formService: OGEForm450Service,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.settingsService.get().then(response => {
            this.settings = response;
        });
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.form = data.form;
            this.prevForm = data.prev;

            if ((this.userService.isInRole(Roles.Reviewer) || this.userService.isInRole(Roles.Admin)) &&
                (this.form.formStatus == FormStatus.SUBMITTED || this.form.formStatus == FormStatus.RE_SUBMITTED || this.form.formStatus == FormStatus.CERTIFIED)) {
                this.mode = "REVIEWER";
            }
            localStorage.setItem('dirtyOvervide', "0");
            localStorage.setItem('goto', '');
        });
    }

    ngAfterViewInit() {
        if (this.form.formStatus == FormStatus.NOT_STARTED && this.form.filer == this.userService.user.upn)
            $('#intro-popup').modal();
    }

    saveForm(form: OgeForm450) {
        //this.form.dateOfAppointment = this.getAppointmentDate();
        this.formService.update(form)
            .then(response => {
                this.form = new OgeForm450();
                this.form = JSON.parse(JSON.stringify(response));;

                //this.userService.user.currentFormStatus = response.formStatus;

                if (form.closeAfterSaving) {
                    this.confirmClose();
                }
                else {
                    this.snackBar.open("Form Saved Successfully", "", {
                        duration: 5000
                    });
                }
            });
    }

    closeForm() {
        if (this.ogeForm450?.canSave() && this.ogeForm450.isDirty())
            $('#confirm-close').modal();
        else
            this.confirmClose();
    }

    saveAndClose() {
        this.ogeForm450?.save(false, true);
    }

    confirmClose() {
        localStorage.setItem('dirtyOvervide', "1");
        $('#confirm-close').modal('hide');

        // Check to see if we were trying to go somewhere other than previous, if not go back to previous
        let prev = localStorage.getItem('goto') ? localStorage.getItem('goto') : '';

        if (prev == '') {
            prev = localStorage.getItem('prev') ? localStorage.getItem('prev') : '/home';
            if (prev && prev.includes('form/'))
                prev = '/';
        }

        this.router.navigate([prev]);
    }

    compareForms() {
        $('#compare-modal').modal();
    }
}
