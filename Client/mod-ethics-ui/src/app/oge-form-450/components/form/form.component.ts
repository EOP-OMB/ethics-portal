import { Component, Input, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, OnChanges, ElementRef, SimpleChanges } from '@angular/core';
import { CurrentUserService } from 'mod-framework';

import { environment } from '@src/environments/environment';
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { ReportableInformation } from '@shared/models/reportable-information.model';
import { Settings } from '@shared/models/settings.model';
import { FormStatus } from '@shared/static/form-status.const';
import { Helper } from '@shared/static/helper.funcs';
import { InfoType } from '@shared/static/info-type.const';
import { ReportingStatus } from '@shared/static/reporting-status.const';
import { Roles } from '@shared/static/roles.const';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit, OnChanges, AfterViewInit {
    @Input()
    form: OgeForm450 = new OgeForm450();

    @Input()
    prevForm: OgeForm450 | null = null;

    compareForm: OgeForm450 | null = null;

    @Input()
    settings: Settings = new Settings();

    @Output()
    onSave = new EventEmitter<any>();

    @Output()
    onClose = new EventEmitter<any>();

    @Output()
    onCompare = new EventEmitter<any>();

    @Input()
    mode: string = 'EDIT';  // EDIT - Regular mode for filers, REVIEW - Highlight changes can still edit/review as normal, COMPARE - Side by Side mode, read only

    @ViewChild(('topDiv')) topDiv: any;

    origForm: OgeForm450 = new OgeForm450();

    printView: boolean = false;
    isReviewer: boolean;
    isAdmin: boolean;
    isSupport: boolean;

    showWatermark: boolean = false;

    assetsAndIncome: ReportableInformation[] = [];
    liabilities: ReportableInformation[] = [];
    outsidePositions: ReportableInformation[] = [];
    agreementsOrArrangements: ReportableInformation[] = [];
    giftsOrTravelReimbursements: ReportableInformation[] = [];

    compareAssets: ReportableInformation[] = [];
    compareLiabilities: ReportableInformation[] = [];
    comparePositions: ReportableInformation[] = [];
    compareArrangements: ReportableInformation[] = [];
    compareGifts: ReportableInformation[] = [];

    tempAppointmentDate: Date | null = null;
    tempReviewDate: Date | null = null;

    constructor(
        private userService: CurrentUserService
    ) {
        this.isReviewer = this.userService.isInRole(Roles.Reviewer);
        this.isAdmin = this.userService.isInRole(Roles.Admin);
        this.isSupport = this.userService.isInRole(Roles.Support);
    }

    ngOnInit(): void {
        $("#partI_Examples").collapse('show');
        $("#partII_Examples").collapse('show');
        $("#partIII_Examples").collapse('show');
        $("#partIV_Examples").collapse('show');
        $("#partV_Examples").collapse('show');

        $("#partI_Instructions").collapse('show');
        $("#partII_Instructions").collapse('show');
        $("#partIII_Instructions").collapse('show');
        $("#partIV_Instructions").collapse('show');
        $("#partV_Instructions").collapse('show');
    }

    scrollTo(hash: string): void {
        if (!$(hash).is(":visible")) {
            hash = "#steps";
            $("#section-off-alert").alert();
            $("#section-off-alert").fadeTo(5000, 500).slideUp(500, function () {
                $("#section-off-alert").slideUp(500);
            });
        }

        this.scroll(hash);
    }

    scroll(hash: string): void {
        let top = $(hash).offset()?.top ? $(hash).offset()?.top : 0;
        let parent = $('mat-sidenav-content').scrollTop();
        top = (top ? top : 0) + (parent ? parent : 0);

        // animate
        $('mat-sidenav-content').animate({

            scrollTop: (top ? top : 0) - 143
        }, 500, function () {

        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.prevForm && changes.prevForm.currentValue) {
            if (this.mode != "EDIT" && this.prevForm != null)
                this.compareForm = this.prevForm;

            if (this.compareForm != null && this.compareForm.reportableInformationList) {
                this.compareAssets = this.compareForm.reportableInformationList.filter(x => x.infoType === InfoType.AssetsAndIncome);
                this.compareLiabilities = this.compareForm.reportableInformationList.filter(x => x.infoType === InfoType.Liabilities);
                this.comparePositions = this.compareForm.reportableInformationList.filter(x => x.infoType === InfoType.OutsidePositions);
                this.compareArrangements = this.compareForm.reportableInformationList.filter(x => x.infoType === InfoType.AgreementsOrArrangements);
                this.compareGifts = this.compareForm.reportableInformationList.filter(x => x.infoType === InfoType.GiftsOrTravelReimbursements);
            }
        }

        if (changes.form && changes.form.currentValue) {
            this.tempReviewDate = this.form.dateOfSubstantiveReview;

            this.assetsAndIncome = this.form.reportableInformationList.filter(x => x.infoType === InfoType.AssetsAndIncome);
            this.liabilities = this.form.reportableInformationList.filter(x => x.infoType === InfoType.Liabilities);
            this.outsidePositions = this.form.reportableInformationList.filter(x => x.infoType === InfoType.OutsidePositions);
            this.agreementsOrArrangements = this.form.reportableInformationList.filter(x => x.infoType === InfoType.AgreementsOrArrangements);
            this.giftsOrTravelReimbursements = this.form.reportableInformationList.filter(x => x.infoType === InfoType.GiftsOrTravelReimbursements);

            this.origForm = JSON.parse(JSON.stringify(this.form));
            this.tempAppointmentDate = Helper.getDate(this.form.dateOfAppointment);

            this.disableForm();

            if (this.form.submittedPaperCopy) {
                this.showWatermark = true;
            }
        }
    }

    ngAfterViewInit() {
        var headerHtml = $('#pageHeader').html();
        $('.header').html(headerHtml);

        if (this.mode != "COMPARE" && this.form.formStatus == FormStatus.NOT_STARTED && this.form.filer == this.userService.user.upn) {
            $('#intro-popup').modal();
        }

        this.initializePopovers();
    }

    public get newEntrant(): string {
        return ReportingStatus.NEW_ENTRANT;
    }

    addRow(infoType: string): void {
        var newRow = new ReportableInformation();

        newRow.infoType = infoType;
        newRow.name = "";
        newRow.additionalInfo = "";
        newRow.description = "";
        newRow.noLongerHeld = false;
        switch (infoType) {
            case InfoType.AssetsAndIncome:
                this.assetsAndIncome.push(newRow);
                break;
            case InfoType.Liabilities:
                this.liabilities.push(newRow);
                break;
            case InfoType.OutsidePositions:
                this.outsidePositions.push(newRow);
                break;
            case InfoType.AgreementsOrArrangements:
                this.agreementsOrArrangements.push(newRow);
                break;
            case InfoType.GiftsOrTravelReimbursements:
                this.giftsOrTravelReimbursements.push(newRow);
                break;
        }

        this.form.reportableInformationList.push(newRow);
    };

    inputDisabled: boolean = false;
    reviewCommentsDisabled: boolean = true;
    showReviewSection: boolean = true;

    disableForm(): void {
        if (!this.canSave()) {
            this.inputDisabled = true;
        }
        if ((!this.isReviewer && !this.isAdmin) || this.mode == "COMPARE")
            this.reviewCommentsDisabled = true;
        else if (!this.isCertified())
            this.reviewCommentsDisabled = false;

        // Hide reviewer section until certified or if it's returned to user
        if (!(this.isAdmin || this.isReviewer || this.isSupport || this.isCertified() || this.isMissingInformation()))
            this.showReviewSection = false;
    }

    initializePopovers(): void {
        //$('#lnkPartI').popover({ container: 'body', html: true, content: function () { return $('#partI_Instructions').html(); }, sanitize: false });
        //$('#lnkPartII').popover({ container: 'body', html: true, content: function () { return $('#partII_Instructions').html(); }, sanitize: false });
        //$('#lnkPartIII').popover({ container: 'body', html: true, content: function () { return $('#partIII_Instructions').html(); }, sanitize: false });
        //$('#lnkPartIV').popover({ container: 'body', html: true, content: function () { return $('#partIV_Instructions').html(); }, sanitize: false });
        //$('#lnkPartV').popover({ container: 'body', html: true, content: function () { return $('#partV_Instructions').html(); }, sanitize: false });

        $('#lnkPartIExample').popover({ container: 'body', html: true, content: function () { return $('#partIExample').html(); }, sanitize: false });
        $('#lnkPartIIExample').popover({ container: 'body', html: true, content: function () { return $('#partIIExample').html(); }, sanitize: false });
        $('#lnkPartIIIExample').popover({ container: 'body', html: true, content: function () { return $('#partIIIExample').html(); }, sanitize: false });
        $('#lnkPartIVExample').popover({ container: 'body', html: true, content: function () { return $('#partIVExample').html(); }, sanitize: false });
        $('#lnkPartVExample').popover({ container: 'body', html: true, content: function () { return $('#partVExample').html(); }, sanitize: false });

        if (this.mode != "COMPARE") {
            $('#instructionsI').html($('#partI_Instructions').html());
            $('#instructionsII').html($('#partII_Instructions').html());
            $('#instructionsIII').html($('#partIII_Instructions').html());
            $('#instructionsIV').html($('#partIV_Instructions').html());
            $('#instructionsV').html($('#partV_Instructions').html());

            $('#partI_Examples').html($('#partIExample').html());
            $('#partII_Examples').html($('#partIIExample').html());
            $('#partIII_Examples').html($('#partIIIExample').html());
            $('#partIV_Examples').html($('#partIVExample').html());
            $('#partV_Examples').html($('#partVExample').html());
        }
    };

    public isDirty(): boolean {

        return JSON.stringify(this.origForm) != JSON.stringify(this.form);
    }

    goBack(): void {
        this.onClose.emit();
    }


    print(): void {
        window.print();
    }

    save(submitting: boolean, close: boolean = false): void {
        this.form.closeAfterSaving = close;

        if (this.canSave() || submitting || this.canReview()) {
            this.onSave.emit(this.form);
        }
    }

    compare() {
        this.onCompare.emit();
    }

    signClicked() {
        var valid = this.validateForm();

        if (valid && this.canSubmit()) {
            $("#confirm-sign").modal();
        }
        else {
            $("#invalid-alert").alert();
            $("#invalid-alert").fadeTo(5000, 500).slideUp(500, function () {
                $("#invalid-alert").slideUp(500);
            });

            this.scroll('#oge-form');
        }
    }

    submit(): void {
        // Filer sign & submit button
        var valid = this.validateForm();

        if (valid && this.canSubmit()) {
            this.form.isSubmitting = true;
            this.save(true, true);
            this.disableForm();
        }
        else {
            $("#invalid-alert").alert();
            $("#invalid-alert").fadeTo(5000, 500).slideUp(500, function () {
                $("#invalid-alert").slideUp(500);
            });

            this.scroll('#oge-form');
        }
    }

    cancel(): void {
        this.form.submittedPaperCopy = false;
    }

    validateForm(): boolean {
        var divs = $('#oge-form').find('.required');

        var valid = true;

        divs.each(function () {
            var input = $(this).next(':input');

            if (input.val() == "") {
                $(this).parent('div').addClass("has-error");

                valid = false;
            } else {
                $(this).parent('div').removeClass("has-error");
            }

        });

        return valid;
    }

    certify(): void {
        if (this.canCertify()) {
            this.form.reviewingOfficialSignature = this.userService.user.displayName;
            this.save(false, true);
        }
    }

    reviewComplete(): void {
        if (this.canReview()) {
            this.form.substantiveReviewerUpn = this.userService.user.upn;
            this.form.substantiveReviewer = this.userService.user.displayName;
            this.form.dateOfSubstantiveReview = this.tempReviewDate;
            this.form.formStatus = 'In Review';
            
            this.save(false, false);
        }
    }

    markReadyToCertify(): void {
        if (this.canReview()) {
            this.form.formStatus = 'Ready to Certify';

            this.save(false, false);
        }
    }

    submitPaper(): void {
        this.form.submittedPaperCopy = true;
        this.form.isSubmitting = true;
        this.save(true, true);
    }

    certifyPaper(): void {
        this.form.reviewingOfficialSignature = this.userService.user.displayName;
        this.form.commentsOfReviewingOfficial = "Certification based on filer’s paper submission.\n" + this.form.commentsOfReviewingOfficial;
        this.form.submittedPaperCopy = true;
        this.save(true, true);
    }

    reject(): void {
        if (this.canCertifyAll()) {
            this.form.isRejected = true;
            this.save(false, true);
        }
    }

    get isMyForm(): boolean {
        return (this.form.filer == this.userService.user.upn);
    }

    canSubmit(): boolean {
        var ret = (this.form.formStatus == FormStatus.NOT_STARTED || this.form.formStatus == FormStatus.DRAFT || this.form.formStatus == FormStatus.MISSING_INFORMATION) && this.isMyForm && this.mode != "COMPARE";

        return ret;
    }

    isSubmitted(): boolean {
        return (this.form.formStatus == FormStatus.SUBMITTED || this.form.formStatus == FormStatus.RE_SUBMITTED || this.form.formStatus == FormStatus.IN_REVIEW || this.form.formStatus == FormStatus.READY_TO_CERT);
    }

    canReview(): boolean {
        return this.isSubmitted() && (this.isReviewer || this.canSupport() || this.isAdmin) && (!this.isMyForm || environment.debug) && this.mode != "COMPARE";
    }

    canSupport(): boolean {
        return this.isSupport && this.form.reportingStatus == ReportingStatus.ANNUAL && this.form.isBlank;
    }

    canCertify(): boolean {
        return this.isSubmitted() && (this.isReviewer || this.isAdmin || this.canSupport()) && (!this.isMyForm || environment.debug) && this.mode != "COMPARE";
    }

    canCertifyAll(): boolean {
        return this.isSubmitted() && (this.isReviewer || this.isAdmin) && (!this.isMyForm || environment.debug) && this.mode != "COMPARE";
    }

    canSubmitPaper(): boolean {
        return (this.isReviewer || this.isAdmin) && !this.isSubmitted() && !this.isCertified() && this.mode != "COMPARE";
    }

    isCertified(): boolean {
        return (this.form.formStatus == FormStatus.CERTIFIED);
    }

    isMissingInformation(): boolean {
        return (this.form.formStatus == FormStatus.MISSING_INFORMATION);
    }

    canSave(): boolean {
        return this.canSubmit() || this.canCertifyAll() || this.canLeavePrivateComment();
    }

    canLeavePrivateComment() {
        return this.isReviewer || this.isAdmin;
    }

    canDecline() {
        return this.canCertifyAll();
    }

    canEdit(): boolean {
        var ret = (this.canCertifyAll() || !(this.isSubmitted() || this.form.formStatus == FormStatus.CERTIFIED || this.form.formStatus == FormStatus.CANCELED || this.form.formStatus == FormStatus.DECLINED)) && this.mode != "COMPARE";

        return ret;
    }

    closeModal(id: string): void {
        this.toggleModal(id, 'hide');
    }

    showModal(id: string): void {
        this.toggleModal(id, 'show');
    }

    toggleModal(id: string, action: "show" | "hide"): void {
        $('#' + id).modal(action);
    }

    promptCertify() {
        if (!this.tempReviewDate) {
            this.toggleModal("review-date-not-set", "show");
        }
        else {
            this.form.dateOfSubstantiveReview = this.tempReviewDate;
            this.toggleModal("review-date-not-set", "hide");
            this.toggleModal("confirm-certify", "show");
        }
    }

    useToday() {
        this.tempReviewDate = new Date();
        this.promptCertify();
    }

    decline() {
        if (this.canDecline()) {
            this.form.formStatus = FormStatus.DECLINED;
            this.save(false, true);
        }
    }
}


