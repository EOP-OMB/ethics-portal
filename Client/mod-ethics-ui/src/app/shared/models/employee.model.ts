import { DtoBase } from "mod-framework";

export class Employee extends DtoBase {
    constructor() {
        super();
    }

    copy(emp: Employee) {
        this.id = emp.id;
        this.title = emp.title;
        this.upn = emp.upn;
        this.inactive = emp.inactive;
        this.filerType = emp.filerType;
        this.employeeStatus = emp.employeeStatus;
        this.reportingStatus = emp.reportingStatus;
        this.last450Date = emp.last450Date;
        this.appointmentDate = emp.appointmentDate;
        this.currentFormId = emp.currentFormId;
        this.currentFormStatus = emp.currentFormStatus;
        this.dueDate = emp.dueDate;
        this.notes = emp.notes;

        this.position = emp.position;
        this.emailAddress = emp.emailAddress;
        this.displayName = emp.displayName;
        this.mobilePhone = emp.mobilePhone;
        this.agency = emp.agency;
        this.office = emp.office;
        this.profileUrl = emp.profileUrl;
        this.profileImage = emp.profileImage;
        this.generateForm = emp.generateForm;

        this.newEntrantEmailText = emp.newEntrantEmailText;
        this.annualEmailText = emp.annualEmailText;
        this.division = emp.division;

        if (emp.reportsTo) {
            this.reportsTo = new Employee();
            this.reportsTo.copy(emp.reportsTo);
        }

        this.departmentOverride = emp.departmentOverride;

        this.type = emp.type;
        this.subtype = emp.subtype;

        this.officePhone = emp.officePhone;
        this.location = emp.location;
        this.city = emp.city;
        this.state = emp.state;
        this.thumbnail = emp.thumbnail;

        if (emp.directReports) {
            this.directReports = [];
            emp.directReports.forEach(x => this.directReports?.push(x));
        }
        
        this.hasImage = emp.hasImage;
        this.bio = emp.bio;

        this.departmentName = emp.departmentName;
        this.hireDate = emp.hireDate;
        this.appointmentType = emp.appointmentType;
        this.appointmentType2 = emp.appointmentType2;
        this.political = emp.political;
        this.annualSalary = emp.annualSalary;
    }
        
    title: string = "";
    upn: string = "";
    inactive: boolean = false;
    inactiveDate?: Date;
    filerType: string = "";
    employeeStatus: string = "";  // Now DetaileeType values of 'Detailee' and 'IPA'
    reportingStatus: string = "";
    last450Date?: Date;
    appointmentDate: string = "";
    currentFormId: number = 0;
    currentFormStatus: string = "";
    dueDate: string = "";
    notes: string = "";

    position: string = "";
    emailAddress: string = "";
    displayName: string = "";
    mobilePhone: string = "";
    agency: string = "";
    office: string = "";
    profileUrl: string = "";
    profileImage: string = "";
    generateForm: boolean = false;

    newEntrantEmailText: string = "";
    annualEmailText: string = "";
    division: string = "";

    type: string = "";      // Political, Career
    subtype: string = "";   // Political: PAS, PA, Non career SES/SL, Non career GS; Career: SES/SL, GS, GS/Intermittent Consultant, GS/SGE, GS/Intern (unpaid)

    officePhone: string = "";
    location: string = "";
    city: string = "";
    state: string = "";
    thumbnail: string = "";

    reportsTo: Employee | null = null;
    directReports: Employee[] | null = null;

    hasImage: boolean = false;
    departmentOverride: string = "";
    bio: string = "";

    departmentName: string = "";
    hireDate?: Date;
    appointmentType: string = "";
    appointmentType2: string = "";
    political: boolean = false;
    annualSalary: number |  null = null;

    get cityStateFormatted(): string {
        var cs = this.city;

        if (this.state != 'NA' && this.state != '')
            cs = cs + ", " + this.state;

        return cs;
    }

    get locationFormatted(): string {
        var loc = this.location.replace('Eisenhower Executive Office Building', 'EEOB');

        loc = loc.replace(' Street, NW', '');

        loc = loc.replace('New Executive Office Building', 'NEOB');

        return loc;
    }

    get statusText(): string {
        return (this.inactive ? "Inactive" : "Active") + (this.employeeStatus ? " - " + this.employeeStatus : "");
    }
}
