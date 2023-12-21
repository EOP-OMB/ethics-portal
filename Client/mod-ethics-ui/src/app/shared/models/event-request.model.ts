import { DtoBase, UserInfo } from 'mod-framework';
import { Helper } from '../static/helper.funcs';
import { Attachment } from './attachment.model';
import { Attendee } from './attendee.model';

export class EventRequest extends DtoBase {
    title: string;

    // Event Details
    eventName: string = '';
    eventStartDate: Date;
    eventEndDate: Date;
    eventLocation: string;
    approximateAttendees: number;
    crowdDescription: string;
    isFundraiser: boolean;
    isOpenToMedia: boolean;
    isQAndA: boolean;
    moderatorsAndPanelists: string;
    requiresTravel: boolean;
    internationalTravel: boolean;
    fairMarketValue: number;
    whatIsProvided: string;
    whoIsPaying: string;

    //Invitation
    guestsInvited: boolean;
    receivedInvitation: boolean;
    individualExtendingInvite: string;
    isIndividualLobbyist: boolean;
    orgExtendingInvite: string;
    isOrgLobbyist: boolean;
    typeOfOrg: number = 0;
    orgOther: string;
    orgHostingEvent: string;
    isHostLobbyist: boolean;
    typeOfHost: number = 0;
    hostOther: string;

    // Contacts and Additional Info
    eventContactName: string;
    eventContactPhone: string;
    eventContactEmail: string;
    contactEmail: string;
    contactNumber: string;
    contactComponent: string;       // Department?
    additionalInformation: string;

    // Audit Stuff
    submittedBy: string; // UPN of submitter
    submitter: string;  // Display Name of submitter
    submittedDate: Date;
    
    // Reviewer Stuff
    guidanceGiven: string;
    assignedTo: string;
    assignedToUpn: string = '';
    status: string = '';
    closedReason: string;
    closedBy: string;
    closedDate: Date;
    
    attachmentGuid: string;

    eventRequestAttendees: Attendee[];
    eventRequestAttachments: Attachment[];

    attendeesString: string = '';

    get eventDates(): string {
        var eventDates = "";

        var eventDates = Helper.formatDate(this.eventStartDate);

        if (this.eventEndDate && this.eventEndDate != this.eventStartDate)
            eventDates += ' - ' + Helper.formatDate(this.eventEndDate);

        return eventDates;
    }

    get hasAttachments(): boolean {
        return this.eventRequestAttachments && this.eventRequestAttachments.length > 0;
    }

    dateValue: number;
    dateFilter: string = '';

    
    
}
