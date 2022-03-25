import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from 'mod-framework';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { OGEForm450Service } from '@shared/services/oge-form-450.service';
import { SettingsService } from '@shared/services/settings.service';
import { FormData } from '@oge450/models/form-data.model';
import { Settings } from '@shared/models/settings.model';
import { Widget } from '@shared/models/widget.model';
import { ExtensionRequest } from '@shared/models/extension-request.model';
import { MatDrawer } from '@angular/material/sidenav';
import { HelpfulLinksService } from '@oge450/services/helpful-link.service';
import { HelpfulLink } from '@oge450/models/helpful-link.model';
import { EthicsTeam } from '@shared/models/ethics-team.model';
import { EthicsTeamService } from '@shared/services/ethics-team.service';
import { ExtensionRequestService } from '@shared/services/extension-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExtensionStatus } from '../../../shared/static/extension-status.const';

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer;

    formData!: FormData;
    settings: Settings = new Settings();

    noFilingWidget: Widget = new Widget();

    forms: OgeForm450[] = [];

    selectedExtension?: ExtensionRequest;

    helpfulLinks: HelpfulLink[] = [];
    ethicsTeam: EthicsTeam[] = [];

    get user() {
        return this.userService.user;
    }

    constructor(
        private userService: CurrentUserService,
        private router: Router,
        private extensionRequestService: ExtensionRequestService,
        private linksService: HelpfulLinksService,
        private teamService: EthicsTeamService,
        private formService: OGEForm450Service,
        private settingsService: SettingsService,
        private snackBar: MatSnackBar    ) { }
    
    ngOnInit(): void {
        this.getLinks();
        this.getEthicsTeam();
        this.getForms();
        this.loadSettings();
        this.getLatestForm();
    }

    getLinks(): void {
        this.linksService.getAll()
            .then(response => {
                this.helpfulLinks = response;
            });
    }

    getEthicsTeam(): void {
        this.teamService.getAll()
            .then(response => {
                this.ethicsTeam = response;
            });
    }

    loadSettings(): Promise<void> {
        return this.settingsService.get()
            .then(response => {
                this.settings = response;
                this.updateSettingsWidget();
            });
    }

    getLatestForm(): void {

        if (this.userService.user) {
            this.formService
                .getCurrentForm()
                .then(form => {
                    this.formData = new FormData()
                    this.formData.form = form;
                    this.formData.setStatus();
                });
        }
    }

    updateSettingsWidget() {
        if (this.settings) {
            this.noFilingWidget.title = this.settings.currentFilingYear.toString();
            this.noFilingWidget.text = "No OGE 450";
            this.noFilingWidget.actionText = "please await instructions";
            this.noFilingWidget.color = "success";
        }
    }

    getForms(): void {
        this.formService
            .getMyForms()
            .then(forms => {
                this.forms = forms;
                this.forms = this.forms.sort((a, b) => a.year < b.year ? 1 : a.year > b.year ? -1 : 0);
            });
    }

    gotoDetail(id: number): void {
        this.router.navigate(['/form', id]);
    }

    closeExtensionRequest(evt: any) {
        if (evt) {
            // close modal
            $('#extension-modal').modal('hide');
        }
    }

    onFilingClick() {
        this.router.navigate(['/form', this.formData.form.id]);
    }

    onDaysClick() {
        this.extensionRequestService.get(this.formData.form.id).then(response => {
            this.selectedExtension = response;
            this.selectedExtension.form = this.formData.form;
            this.drawer.open();
        });
    }

    drawerClosing(): void {
        this.selectedExtension = undefined;
    }

    saveExtension(extension: ExtensionRequest): void {
        this.extensionRequestService.save(extension).then(response => {
            this.snackBar.open("Extension Saved Successfully", "", {
                duration: 5000
            });
            this.drawer.close();
        });
    }

    approveExtension(extension: ExtensionRequest): void {
        extension.status = ExtensionStatus.APPROVED;
        this.saveExtension(extension);
    }

    rejectExtension(extension: ExtensionRequest): void {
        extension.status = ExtensionStatus.REJECTED;
        this.saveExtension(extension);
    }
}
