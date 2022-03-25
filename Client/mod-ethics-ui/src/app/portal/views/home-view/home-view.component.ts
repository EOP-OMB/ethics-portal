import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EthicsTeamService } from '@app/shared/services/ethics-team.service';
import { EthicsFormService } from '@portal/services/ethics-form.service';
import { OGEForm450Service } from '@shared/services/oge-form-450.service';
import { EventRequestService } from '@shared/services/event-request.service';
import { TrainingService } from '@shared/services/training.service';
import { CurrentUserService } from 'mod-framework';
import { EventRequest } from '@shared/models/event-request.model';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { WidgetData } from '@portal/models/widget-data.model';
import { Training } from '@shared/models/training.model';
import { EthicsForm } from '@portal/models/ethics-form.model';
import { EthicsTeam } from '@shared/models/ethics-team.model';
import { environment } from '@src/environments/environment';

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {

    public timeline: any[] = [];
    public options: any[] = [];
    public guidance: any[] = [];

    private pendingEvents: EventRequest[] = [];
    private currentForm: OgeForm450 = new OgeForm450();

    private widgets: WidgetData[] = [];

    public guidanceFiles: EthicsForm[] = [];
    public ethicsFormFiles: EthicsForm[] = [];
    public ethicsTeam: EthicsTeam[] = [];
    
    constructor(
        private userService: CurrentUserService,
        private trainingService: TrainingService,
        //private timelineService: TimelineService,
        private formService: OGEForm450Service,
        private eventService: EventRequestService,
        private ethicsFormService: EthicsFormService,
        private ethicsTeamService: EthicsTeamService,
        private router: Router
    ) {
        
    }

    ngOnInit(): void {
        this.getForm();
        //this.getTrainings();
        //this.getEvents();

        //this.getTimeline();
        this.getGuidance();
        this.getEthicsTeam();
    }

    getForm(): void {
        this.formService
            .getCurrentForm()
            .then(form => {
                this.currentForm = form;
                this.set450Status();
                //this.loadingComplete = true;
            });
    }

    set450Status(): void {
        var widget = new WidgetData();

        widget.actionText = "click to view";
        widget.sortOrder = 1;

        if (this.currentForm) {
            widget.id = this.currentForm.id;

            if (this.currentForm.formStatus == 'Certified') {
                widget.status = "CERTIFIED";
                widget.statusColor = "text-success";
            }
            else if (this.currentForm.formStatus == 'Submitted' || this.currentForm.formStatus == 'Re-submitted') {
                widget.status = "SUBMITTED";
                widget.statusColor = "text-primary";
            }
            else if (this.currentForm.isOverdue) {
                widget.status = "OVERDUE";
                widget.statusColor = "text-danger";
                widget.actionText = "<i style='margin-right: 10px; font-size: 1.1em;' class='fa fa-warning text-danger'></i> Please submit your OGE 450 or request an extension";
            }
            else {
                widget.status = "IN PROGRESS";
                widget.statusColor = "text-info";
            }
        }
        else {
            widget.status = "NOT ASSIGNED";
            widget.statusColor = "text-success";
        }

        this.widgets.push(widget);
    }

    getTrainings(): void {
        this.trainingService.getCurrentYear()
            .then(result => {
                var thisYearTraining = result;

                var annualTraining: Training = new Training();
                var initialTraining: Training = new Training();

                var widget = new WidgetData();

                widget.actionText = "click to certify training";
                widget.sortOrder = 2;

                for (let tra of thisYearTraining) {
                    if (tra.trainingType == "Annual")
                        annualTraining = tra;
                    else if (tra.trainingType == "Initial") {
                        initialTraining = tra;
                    }
                }

                // ToDo: Incorporate initial training.
                //if (initialTraining && this.currentUser.requiresInitialTraining) {
                //    var initials = result.filter(x => x.trainingType == "Initial");
                //    this.initialTraining = initials.length > 0 ? initials[0] : null;
                //}

                widget.status = new Date().getFullYear().toString() + " Training";

                if (annualTraining.id > 0) {
                    widget.id = annualTraining.id;
                    widget.status = "COMPLETE";
                    widget.statusColor = "text-success";
                }
                else {
                    widget.status = "INCOMPLETE";
                    widget.statusColor = "text-danger";
                }
            });
    }

    getEvents(): void {
        this.eventService.getMyEvents().then(response => {
            var pending = response.filter(x => x.status.includes('Open') == true);

            var widget = new WidgetData();

            widget.actionText = "click to launch app";
            widget.sortOrder = 3;

            var numPending = pending.length;

            if (numPending == 0)
                widget.statusColor = "text-success";
            else if (numPending < 3)
                widget.statusColor = "text-info";
            else if (numPending < 6)
                widget.statusColor = "text-warning";
            else
                widget.statusColor = "text-danger";

            widget.status = numPending.toString() + ((numPending == 1) ? " Event" : " Events");

            this.widgets.push(widget);
        });
    }

    getGuidance(): void {
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

    getTimeline(): void {
        //this.timelineService.get(this.maxTimeline)
        //    .then(result => {
        //        // Use the Type from the API to assign CssClass and Icon
        //        this.timelineVm = result;

        //        if (this.timelineVm.timeline) {

        //            for (let tl of this.timelineVm.timeline) {
        //                if (tl.type == "OGEForm450") {
        //                    tl.cssClass = "oge450Class";
        //                    tl.icon = "fa-file-text";
        //                }
        //                else if (tl.type == "Training") {
        //                    tl.cssClass = "trainingClass";
        //                    tl.icon = "fa-balance-scale";
        //                }
        //                else if (tl.type == "Event") {
        //                    tl.cssClass = "eventClass";
        //                    tl.icon = "fa-calendar-check-o";
        //                }
        //            }
        //        }

        //        this.doFilterTimeline();
        //    });
    }
}
