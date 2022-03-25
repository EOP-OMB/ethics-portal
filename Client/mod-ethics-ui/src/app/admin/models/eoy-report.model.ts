import { OgeForm450 } from "../../shared/models/oge-form-450.model";

export class EoyReport {
    year: number = 0;

    requiredForms: number = 0;
    filedAlternativeForms: number = 0;  // Electronically Certified
    filedForms: number = 0;             // Paper Forms

    numberOfElectronicFilers: number = 0;  // Not Forms, unique individuals who filed electronically

    certifiedOrClosed: number = 0;
    reviewedIn60Days: number = 0;
    certifiedIn60Days: number = 0;

    closedReports: OgeForm450[] = [];
    notCertifiedIn60Days: OgeForm450[] = [];
    notReviewedIn60Days: OgeForm450[] = [];
    requiredVsFiled: OgeForm450[] = [];
    nonYearFilings: OgeForm450[] = [];
}
