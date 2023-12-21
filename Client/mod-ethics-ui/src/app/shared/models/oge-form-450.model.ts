import { DtoBase } from 'mod-framework';
import { Helper } from '../static/helper.funcs';
import { ReportableInformation } from './reportable-information.model';

export class OgeForm450 extends DtoBase {
    filer: string = "";
    year: number = 0;
    dateReceivedByAgency: string = "";
    employeesName: string = "";
    emailAddress: string = "";
    positionTitle: string = "";
    grade: string = "";
    agency: string = "";
    branchUnitAndAddress: string = "";
    workPhone: string = "";
    reportingStatus: string = "";
    dateOfAppointment: string = "";
    isSpecialGovernmentEmployee: boolean = false;
    mailingAddress: string = "";

    hasAssetsOrIncome: string = "";
    hasLiabilities: string = "";
    hasOutsidePositions: string = "";
    hasAgreementsOrArrangements: string = "";
    hasGiftsOrTravelReimbursements: string = "";

    formStatus: string = "";
    employeeSignature: string = "";
    dateOfEmployeeSignature: string = "";

    reviewingOfficialSignature: string = "";
    dateOfReviewerSignature: string = "";
    commentsOfReviewingOfficial: string = "";

    reportableInformationList: ReportableInformation[] = [];

    dueDate: Date = new Date();

    isRejected: boolean = false;
    rejectionNotes: string = "";

    daysExtended: number = 0;

    isOverdue: boolean = false;

    extendedText: string = "";
    closeAfterSaving: boolean = false;
    dateOfSubstantiveReview: Date | null = null;
    submittedPaperCopy: boolean = false;
    isSubmitting: boolean = false;
    substantiveReviewer: string = "";
    substantiveReviewerUpn: string = "";
    reviewStatus: string = "";
    isBlank: boolean = false;
    isUnchanged: boolean = false;
    employeeEmail: string = "";

    formFlags: string = "";
    assignedToUpn: string = "";
    assignedTo: string = "";

    privateComments: string = "";
    declineReason: string = "";
    reasonOther: string = "";

    public get dueDateString(): string | null {
        return Helper.formatDate(this.dueDate);
    }

    public get dateSubmitted(): Date | null {
        return Helper.getDate(this.dateOfEmployeeSignature);
    }

    public get daysSinceSubmission(): number {
        return Helper.getDaysSince(this.dateOfEmployeeSignature);
    }

    public get submissionDate(): Date | null {
        return Helper.getDate(this.dateOfEmployeeSignature);
    }

    public get certifiedIn60Days(): string {
        return this.calcCertDays() <= 60 ? 'YES' : 'NO';
    }

    public get reviewedIn60Days(): string {
        return this.calcReviewDays() <= 60 ? 'YES' : 'NO';
    }

    public get daysToCertification() {
        var days = this.calcCertDays();

        if (days)
            return days.toString();
        else
            return '';
    }

    public calcCertDays(): number {
        var days: number = 0;

        if (this.dateReceivedByAgency && this.dateOfReviewerSignature) {
            days = this.calcDaysBetween(new Date(this.dateReceivedByAgency), new Date(this.dateOfReviewerSignature));
        }

        return days;
    }

    public get daysToReview() {
        var days = this.calcReviewDays()

        if (days)
            return days.toString();
        else
            return '';
    }

    calcReviewDays(): number {
        var days: number = 0;

        if (this.dateOfSubstantiveReview && this.dateOfReviewerSignature) {
            days = this.calcDaysBetween(new Date(this.dateOfSubstantiveReview), new Date(this.dateReceivedByAgency));
        }

        return days;
    }

    calcDaysBetween(date1: Date, date2: Date) {
        var diff = Math.abs(date1.getTime() - date2.getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

        return diffDays;
    }
}
