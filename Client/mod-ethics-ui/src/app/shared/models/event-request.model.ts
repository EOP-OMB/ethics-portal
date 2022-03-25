import { DtoBase, UserInfo } from 'mod-framework';
import { Attachment } from './attachment.model';
import { Attendee } from './attendee.model';

export class EventRequest extends DtoBase {
    title: string = "";

    submittedBy: string = "";
    submitter: string = "";
    eventName: string = "";
    guestInvited?: boolean;
    eventStartDate?: Date;
    eventEndDate?: Date;
    eventContactName: string = "";
    eventContactPhone: string = "";
    individualExtendingInvite: string = "";
    isIndividualLobbyist?: boolean;
    orgExtendingInvite: string = "";
    isOrgLobbyist?: boolean;
    typeOfOrg: number = 0;
    orgOther: string = "";
    orgHostingEvent: string = "";
    isHostLobbyist?: boolean;
    typeOfHost: number = 0;
    hostOther: string = "";
    isFundraiser?: boolean;
    whoIsPaying: string = "";
    fairMarketValue?: number;
    requiresTravel?: boolean;
    internationalTravel?: boolean;
    additionalInformation: string = "";
    eventLocation: string = "";
    crowdDescription: string = "";
    approximateAttendees?: number;
    isOpenToMedia?: boolean;
    guidanceGiven: string = "";
    assignedTo: string = "";
    status: string = "";
    closedReason: string = "";
    closedBy: string = "";
    closedDate?: Date;
    contactNumber: string = "";
    contactEmail: string = "";
    contactComponent: string = "";
    attachmentGuid: string = "";

    attendees: Attendee[] = [];
    attachments: Attachment[] = [];

    attendeesString: string = "";
    eventDates: string = "";
    dateValue?: number;
    dateFilter: string = "";
}




