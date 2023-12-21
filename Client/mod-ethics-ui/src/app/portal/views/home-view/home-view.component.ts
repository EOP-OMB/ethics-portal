import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EthicsTeamService } from '@app/shared/services/ethics-team.service';
import { EthicsFormService } from '@portal/services/ethics-form.service';
import { CurrentUserService } from 'mod-framework';
import { WidgetData } from '@portal/models/widget-data.model';
import { EthicsForm } from '@portal/models/ethics-form.model';
import { EthicsTeam } from '@shared/models/ethics-team.model';
import { PortalService } from '@portal/services/portal.service';
import { PortalData } from '@portal/models/portal-data.model';
import { FormStatus } from '@shared/static/form-status.const';
import { MatSelectionListChange } from '@angular/material/list';
import { HttpResponse } from '@angular/common/http';
import { MatDrawer } from '@angular/material/sidenav';
import { TrainingService } from '@shared/services/training.service';
import { Training } from '@shared/models/training.model';
import { environment } from '@src/environments/environment';

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {

    @ViewChild('drawer', { static: false })
    drawer!: MatDrawer;

    public timeline: any[] = [];
    public options: any[] = [];
    public guidance: any[] = [];
    myTraining: Training[] = null;

    public widgets: WidgetData[] = [];

    public guidanceFiles: EthicsForm[] = [];
    public ethicsFormFiles: EthicsForm[] = [];
    public ethicsTeam: EthicsTeam[] = [];

    public data: PortalData = new PortalData();

    saveUrl: string;
    removeUrl: string;

    constructor(
        private portalService: PortalService,
        private ethicsFormService: EthicsFormService,
        private ethicsTeamService: EthicsTeamService,
        private trainingService: TrainingService,
        private router: Router
    ) {
        this.saveUrl = environment.apiUrl + "/api/guidanceAttachment/upload";
        this.removeUrl = environment.apiUrl + "/api/guidanceAttachment/remove";
    }

    ngOnInit(): void {
        this.loadData();
        this.getForms();
        this.getEthicsTeam();
    }

    loadData(): void {
        this.portalService
            .get(0)  // Can use 0 here as Get will just aggregate the HomeView object
            .then(pd => {
                this.data = pd;
                this.set450Status();
                this.setTrainingWidget();
                this.setEventWidget();
                this.setOutsidePositionWidget();
            });
    }

    set450Status(): void {
        var widget = new WidgetData();

        widget.title = "OGE Form 450";
        widget.actionText = "click to view";
        widget.sortOrder = 1;
        widget.icon = "description";
        widget.color = "blue";

        if (this.data && this.data.current450Status != null) {
            widget.id = this.data.id;

            if (this.data.current450Status == FormStatus.CERTIFIED) {
                widget.status = "CERTIFIED";
                widget.statusColor = "text-success";
            }
            else if (this.data.current450Status == FormStatus.SUBMITTED || this.data.current450Status == FormStatus.RE_SUBMITTED) {
                widget.status = "SUBMITTED";
                widget.statusColor = "text-primary";
            }
            else if (this.data.isOverdue) {
                widget.status = "OVERDUE";
                widget.statusColor = "text-danger";
                widget.actionText = "<i style='margin-right: 10px; font-size: 1.1em;' class='fa fa-warning text-danger'></i> Please submit your OGE 450 or request an extension";
            }
            else if (this.data.current450Status == FormStatus.DECLINED) {
                widget.status = "DECLINED TO CERTIFY";
                widget.statusColor = "text-info";
            } else {
                widget.status = "IN PROGRESS";
                widget.statusColor = "text-info";
            }
        }
        else {
            widget.status = "NOT ASSIGNED";
            widget.actionText = "please await instructions";
            widget.statusColor = "text-success";
        }

        this.widgets.push(widget);
    }

    setTrainingWidget(): void {
        var widget = new WidgetData();

        widget.actionText = "click to certify training";
        widget.sortOrder = 2;
        widget.icon = "balance";
        widget.text = new Date().getFullYear().toString() + " Training";
        widget.title = "Ethics Training";
        widget.color = "orange";

        if (this.data.currentTrainingId > 0) {
            widget.id = this.data.currentTrainingId;
            widget.status = "COMPLETE";
            widget.statusColor = "text-success";
        }
        else {
            widget.status = "INCOMPLETE";
            widget.statusColor = "text-danger";
        }

        this.widgets.push(widget);
    }

    setEventWidget(): void {
        var widget = new WidgetData();

        widget.title = "Event Clearance";
        widget.actionText = "click to request new event";
        widget.sortOrder = 3;
        widget.icon = "event_available";
        widget.color = "green";

        var numPending = this.data.pendingEvents;

        if (numPending == 0)
            widget.statusColor = "text-success";
        else if (numPending < 3)
            widget.statusColor = "text-info";
        else if (numPending < 6)
            widget.statusColor = "text-warning";
        else
            widget.statusColor = "text-danger";

        widget.status = "PENDING"
        widget.text = numPending.toString() + ((numPending == 1) ? " Event" : " Events");

        this.widgets.push(widget);
    }

    setOutsidePositionWidget(): void {
        var widget = new WidgetData();

        widget.actionText = "click to request new outside position";
        widget.sortOrder = 4;
        widget.icon = "work";
        widget.text = "0 Positions";
        widget.title = "Outside Positions";
        widget.color = "dark-blue";

        var numPending = this.data.pendingPositions;

        if (numPending == 0)
            widget.statusColor = "text-success";
        else if (numPending < 3)
            widget.statusColor = "text-info";
        else if (numPending < 6)
            widget.statusColor = "text-warning";
        else
            widget.statusColor = "text-danger";

        widget.text = numPending.toString() + ((numPending == 1) ? " Position" : " Positions");

        widget.status = "PENDING";
        widget.statusColor = "text-success";
       
        this.widgets.push(widget);
    }

    getForms(): void {
        this.ethicsFormService.getAll()
            .then(result => {
                var allForms = result;

                this.guidanceFiles = allForms.filter(x => x.formType == 'Guidance');
                this.ethicsFormFiles = allForms.filter(x => x.formType == 'Form');
            });
    }

    getEthicsTeam(): void {
        this.ethicsTeamService.getAll()
            .then(result => {
                this.ethicsTeam = result;
            });
    }

    formSelected(form: EthicsForm): void {
        //var form = selection.options[0].value as EthicsForm;

        this.ethicsFormService.getFile(form.id).subscribe(async (event) => {
            let data = event as HttpResponse<Blob>;
            const downloadedFile = new Blob([data.body as BlobPart], {
                type: data.body?.type
            });
            
            if (downloadedFile.type != "") {
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                a.download = form.filename;
                a.href = URL.createObjectURL(downloadedFile);
                a.target = '_blank';
                a.click();
                document.body.removeChild(a);
            }
        });
    }

    teamSelected(selection: MatSelectionListChange): void {
        var employee = selection.options[0].value as EthicsTeam;
        var mail = document.createElement("a");
        mail.href = "mailto:" + employee.email;
        mail.click();
    }
    
    widgetClick(title: string): void {
        
        switch (title) {
            case "OGE Form 450":
                this.router.navigate(['/oge450/myform'])
                break;
            case "Event Clearance":
                this.router.navigate(['/events/request/0'])
                break;
            case "Ethics Training":
                this.trainingService.getMyTrainings().then(response => {
                    this.myTraining = response;
                    this.drawer.open();
                });
                
                break;
            case "Outside Positions":
                this.router.navigate(['position/0']);
                break;
        }
    }

    drawerClosing(): void {
        this.myTraining = null;
    }
}
