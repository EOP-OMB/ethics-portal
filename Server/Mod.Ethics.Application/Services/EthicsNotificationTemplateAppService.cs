using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Enumerations;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Notifications;
using Mod.Framework.Notifications.Domain.Entities;
using Mod.Framework.Notifications.Domain.Interfaces;
using Mod.Framework.Runtime.Session;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mod.Ethics.Application.Services
{
    public class EthicsNotificationTemplateAppService : CrudAppService<NotificationTemplateDto, NotificationTemplate>, INotificationTemplateAppService
    {
        public EthicsNotificationTemplateAppService(INotificationTemplateRepository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            Permissions.CanUpdate = Session.Principal.IsInRole(Roles.EthicsAppAdmin) || Session.Principal.IsInRole(Roles.OGESupport);
        }

        public override NotificationTemplateDto Get(int id)
        {
            NotificationTemplateDto dto = base.Get(id);
            dto.TemplateFields = GetEmailFieldsDef(new Dictionary<string, string>(), Convert.ToInt32(dto.Type));

            return dto;
        }

        public override IEnumerable<NotificationTemplateDto> GetAll()
        {
            return base.GetAll().OrderBy(x => Convert.ToInt32(x.Type));
        }

        public Dictionary<string, string> GetEmailFieldsDef(Dictionary<string, string> dict)
        {
            return new Dictionary<string, string>();
        }

        public Dictionary<string, string> GetEmailFieldsDef(Dictionary<string, string> dict, int type)
        {
            switch (type)
            {
                case (int)NotificationTypes.EmployeeSync:
                case (int)NotificationTypes.SyncFailed:
                    break;
                case (int)NotificationTypes.EventRequestAssigned:
                case (int)NotificationTypes.EventRequestConfirmation:
                case (int)NotificationTypes.EventRequestSubmitted:
                    dict.Add("[Attendees]", "All attendee information for this event.");
                    dict.Add("[AttendeeString]", "Comma seperated string of attendy names.");
                              
                    dict.Add("[EventName]", "The name of the event.");
                    dict.Add("[EventStartDate]", "Event Start Date");
                    dict.Add("[EventEndDate]", "Event End Date");
                    dict.Add("[EventLocation]", "Event Location");
                    dict.Add("[ApproximateAttendees]", "Approximate # of Attendees");
                    dict.Add("[CrowdDescription]", "Event Crowd Description");
                    dict.Add("[IsFundraiser]", "Is this a fund-raising event?");
                    dict.Add("[IsOpenToMedia]", "Will the event be open to the press?");
                    dict.Add("[IsQAndA]", "Will there be Q&A?");
                    dict.Add("[ModeratorsAndPanelists]", "If panel discussion, please list moderator and panelists.");
                    dict.Add("[RequiresTravel]", "Will you travel outside the D.C. metro area for this event?");
                    dict.Add("[InternationalTravel]", "International Travel");
                    dict.Add("[FairMarketValue]", "Fair Market Value");
                    dict.Add("[WhoIsPaying]", "Who is Paying?");
                    dict.Add("[TravelForms]", "Comma seperated list of travel form uploads");
                              
                    dict.Add("[GuestsInvited]", "Spouse of Guest Invited?");
                    dict.Add("[IndividualExtendingInvite]", "Individual Extending Invite");
                    dict.Add("[IsIndividualLobbyist]", "Is Individual a registered lobbyist?");
                    dict.Add("[OrgExtendingInvite]", "Organization Extending Invite");
                    dict.Add("[IsOrgLobbyist]", "Is Organization a registered lobbyist?");
                    dict.Add("[TypeOfOrg]", "Type of Organization");
                    dict.Add("[OrgHostingEvent]", "Organization Sponsoring Event");
                    dict.Add("[IsHostLobbyist]", "Is Organization Sponsoring Event a registered lobbyist?");
                    dict.Add("[TypeOfHost]", "Type of Organization (Sponsor)");
                    dict.Add("[Invitations]", "Comma seperated list of invitation uploads");
                    dict.Add("[EventContactName]", "Event Contact Name");
                    dict.Add("[EventContactPhone]", "Event Contact Phone");
                    dict.Add("[EventContactEmail]", "Event Contact Email");
                    dict.Add("[AdditionalInformation]", "Additional Information or Clarifications");
                              
                    dict.Add("[Submitter]", "Name of the person submitting the event.");
                    dict.Add("[ContactEmail]", "Submitter's contact email");
                    dict.Add("[ContactNumber]", "Submitter's phone number");
                    dict.Add("[ContactComponent]", "Submitter's Office/Division");
                    dict.Add("[AssignedTo]", "The Ethics Official Assigned to the request");
                    
                    break;
                case (int)NotificationTypes.ExtensionDecision:
                case (int)NotificationTypes.ExtensionRecieved:
                case (int)NotificationTypes.ExtensionRequest:
                    dict.Add("[User]", "The employee requesting an extension");
                    dict.Add("[Email]", "The email of the user requesting an extension");

                    dict.Add("[Status]", "The status of the Extension Request.");
                    dict.Add("[DaysRequested]", "The number of days requested");
                    dict.Add("[Reason]", "The reason given for the extension");
                    dict.Add("[ReviewerComments]", "The Ethics Officials comments upon review");
                    break;
                case (int)NotificationTypes.FormCertified:
                case (int)NotificationTypes.FormConfirmation:
                case (int)NotificationTypes.FormDueIn3Days:
                case (int)NotificationTypes.FormDueIn7Days:
                case (int)NotificationTypes.FormMissingInformation:
                case (int)NotificationTypes.FormNewAnnual:
                case (int)NotificationTypes.FormNewEntrant:
                case (int)NotificationTypes.FormOverdue:
                case (int)NotificationTypes.FormSubmitted:
                    dict.Add("[User]", "The Display Name of the filer.");
                    dict.Add("[Email]", "The filer's email address.");
                    dict.Add("[Filer]", "The Employees Name field from the OGE Form 450");
                    dict.Add("[ReviewerNote]", "The Comments Of Reviewing Official from the OGE Form 450");
                    dict.Add("[RejectionNotes]", "Notes left by reviewer when Rejecting an OGE Form 450");
                    dict.Add("[DueDate]", "The Due Date of the filer's OGE Form 450");
                    break;
                case (int)NotificationTypes.GuidanceGiven:
                    dict.Add("[Employee]", "The employee to whom guidance was given.");
                    dict.Add("[Guidance]", "The guidance left by the Ethics Official.");
                    dict.Add("[GuidanceType]", "The type of guidance left by the Ethics Official.");
                    dict.Add("[Subject]", "The subject of the guidance left by the Ethics Official.");
                    break;
                case (int)NotificationTypes.OutsidePositionApproval:
                case (int)NotificationTypes.OutsidePositionConfirmation:
                case (int)NotificationTypes.OutsidePositionDisapproved:
                case (int)NotificationTypes.OutsidePositionEthicsApproval:
                case (int)NotificationTypes.OutsidePositionSubmitted:
                    dict.Add("[Employee]", "The employee who submitted the Outside Position request.");
                    
                    dict.Add("[EmployeePhone]", "The employee's phone number.");
                    dict.Add("[EmployeeEmail]", "The employee's email address");
                    dict.Add("[Title]", "The employee's title.");
                    dict.Add("[Grade]", "The employee's grade.");
                    dict.Add("[AnnualSalary]", "The employee's annual salary.");
                    dict.Add("[FilerType]", "The employee's filer type.");
                    dict.Add("[DepartmentName]", "The employee's office.");
                    dict.Add("[Poc]", "The name of the point of contact at the outside position.");
                    dict.Add("[PocPhone]", "The phone number for the POC at the outside position.");
                    dict.Add("[PocEmail]", "The email for the POC at the outside position.");
                    dict.Add("[PositionTitle]", "The title for the outside position.");
                    dict.Add("[OrganizationName]", "The organization with which you request to hold a position.");
                    dict.Add("[PeriodsOfEmployment]", "Period of employment, days per week/hours per day");   // days per week, hours per day
                    dict.Add("[PhysicalLocation]", "The physical location of the outside position.");
                    dict.Add("[IsPaid]", "Is the outside position paid?");
                    dict.Add("[MethodOfCompensation]", "What is the method of compensation.");   // Fee, Honorarium, Salary, Royalty, Retainer, etc.
                    dict.Add("[StartDate]", "The start date of the outside position.");
                    dict.Add("[EndDate]", "The end date of the outside position.");
                    dict.Add("[TypeOfWork]", "What is the nature of the outside position?");             // Nature of Outside Position
                    dict.Add("[Duties]", "What are your duties?");
                    dict.Add("[IsLikeOfficialDuties]", "Are your duties like that of your official duties?");
                    dict.Add("[RelationshipToDuties]", "What is the relationship to your official duties?");   // if isLikeOfficialDuties then required
                    dict.Add("[RequiresAbsence]", "Will the position require absences during normal duty hours?");
                    dict.Add("[InvolveExpense]", "Will the position involve any expense to WHO/EOP?");
                    dict.Add("[UseOfFacilities]", "Will the position involve use of OMB/EOP facilities, property, or manpower?");
                    dict.Add("[RequireDutiesContract]", "Will the position require work for an e ntity that has a Federal contract or grant?");
                    dict.Add("[RequiresDutiesFederal]", "Will the position require performance of duties at a Federal government location?");
                    dict.Add("[InvolveOfficialTitle]", "Will the position involve the use of official title or representation before any Federal agency?");
                    dict.Add("[InvolveDutiesSales]", "Will the position involve work as a sales agent for the purpose of personal commercial solicitation of Federal agencies or personnel?");
                    dict.Add("[InvolveOrg]", "Will the position involve any entity that is engaged, or is endeavoring to engage, in any business transactions or relationships with EOP, OMB, or any other EOP component?");
                    dict.Add("[AdditionalRemarks]", "Any additional remarks?");
                    dict.Add("[SubmittedDate]", "The date the request was submitted.");
                    
                    dict.Add("[Manager]", "The manager who approved an Outside Position request.");
                    dict.Add("[EthicsOfficial]", "The ethics official who approved the Outside Position.");
                    dict.Add("[Action]", "The last action taken on the outside position request form. (eg. Submitted, Approved Manager, etc");
                    dict.Add("[Guidance]", "The guidance left by the Ethics Official who approved the request.");
                    dict.Add("[Disapprover]", "The manager or ethics official who disapproved an Outside Position request.");
                    dict.Add("[DisapprovedReason]", "The disapprove reason left by supervisor/ethics official when disapproving a request.");
                    
                    break;
            }
            
            dict.Add("[SiteUrl]", "The url to the Ethics Portal");

            return dict;
        }
    }
}