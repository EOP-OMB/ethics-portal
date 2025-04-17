using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Attachments.Dtos;
using Mod.Framework.Domain.Entities;
using Mod.Framework.Notifications.Domain.Entities;
using Mod.Framework.Notifications.Domain.Services;
using Mod.Framework.Runtime.Security;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Entities;
using Mod.Framework.User.Interfaces;
using Mod.Framework.User.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;

namespace Mod.Ethics.Application.Services
{
    public class EventRequestAppService : CrudAppService<EventRequestDto, EventRequest>, IEventRequestAppService
    {
        IEmployeeAppService EmployeeAppService;
        IEventRequestAttachmentRepository EventRequestAttachmentRepository;
        IAttendeeAttachmentRepository AttendeeAttachmentRepository;
        private IApplicationRoles _applicationRoles { get; set; }
        private readonly INotificationDomService NotificationService;
        private readonly ISettingsAppService SettingsAppService;
        private readonly IEmployeeRepository _employeeRepository;

        List<Notification> _pendingEmails = new List<Notification>();

        public EventRequestAppService(IEventRequestRepository repository, ISettingsAppService settingsService, IEventRequestAttachmentRepository attachmentRepo, IApplicationRoles applicationRoles, IEmployeeRepository employeeRepository, IAttendeeAttachmentRepository attendeeAttachmentRepo, INotificationDomService notificationService, IEmployeeAppService employeeService, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            EmployeeAppService = employeeService;
            EventRequestAttachmentRepository = attachmentRepo;
            AttendeeAttachmentRepository = attendeeAttachmentRepo;
            NotificationService = notificationService;
            SettingsAppService = settingsService;
            _applicationRoles = applicationRoles;
            _employeeRepository = employeeRepository;
        }

        public List<EventRequestDto> GetMyEvents()
        {
            return this.GetBy(x => x.SubmittedBy.ToLower() == this.Session.Principal.Upn.ToLower()).ToList();
        }

        public EventRequestSummary GetSummary()
        {
            var summary = new EventRequestSummary();

            var filterStartDate = DateTime.Now;
            var filterEndDate = DateTime.Now.AddDays(7);

            filterStartDate = new DateTime(filterStartDate.Year, filterStartDate.Month, filterStartDate.Day);
            filterEndDate = new DateTime(filterEndDate.Year, filterEndDate.Month, filterEndDate.Day, 23, 59, 59);

            var openEvents = Repository.GetAll(x => x.Status.Contains(EventRequestStatuses.OPEN));
            var commsEvents = Repository.GetAll(x => x.Status.Contains(EventRequestStatuses.OPEN_COMMS));
            var upcomingEvents = openEvents.Union(commsEvents).Where(x => x.EventStartDate <= filterEndDate && x.EventStartDate >= filterStartDate);

            summary.OpenOGCEvents = openEvents.Count();
            summary.OpenCOMMSEvents = commsEvents.Count();
            summary.UpcomingEvents = upcomingEvents.Count();
            
            summary.AssignedToMe = Repository.GetAll(x => x.AssignedToUpn.ToLower() == Session.Principal.Upn.ToLower()).Count();

            return summary;
        }

        public override EventRequestDto Get(int id)
        {
            var dto = base.GetIncluding(id, x => x.EventRequestAttachments, y => y.EventRequestAttendees);
            
            dto = MapAttendeeEmployee(dto);

            return dto;
        }

        protected override void OnBeforeCreate(CrudEventArgs<EventRequestDto, EventRequest> e)
        {
            var dto = e.Dto;
            _pendingEmails = new List<Notification>();

            if (dto.Status == EventRequestStatuses.UNASSIGNED)
            {
                // Submitting
                HandleSubmission(e);
                e.Entity.Status = e.Dto.Status;
                e.Entity.SubmittedDate = e.Dto.SubmittedDate;
            }
        }

        private void HandleSubmission(CrudEventArgs<EventRequestDto, EventRequest> e)
        {
            var dto = e.Dto;
            var needsCommsApproval = false;

            if (e.Dto.EventRequestAttendees != null && e.Dto.EventRequestAttendees.Count > 0)
            {
                foreach (AttendeeDto a in e.Dto.EventRequestAttendees)
                {
                    if (a.Capacity == EventRequestCapacity.Official)
                    {
                        needsCommsApproval = true;
                        break;
                    }
                }
            }

            if (needsCommsApproval)
            {
                e.Dto.Status = EventRequestStatuses.OPEN_COMMS;
            } else if (!string.IsNullOrEmpty(e.Entity.AssignedToUpn))
            {
                e.Dto.Status = EventRequestStatuses.OPEN;
            }
            else
            {
                e.Dto.Status = EventRequestStatuses.UNASSIGNED;
            }

            e.Dto.SubmittedDate = DateTime.Now;
            var dict = GetEmailData(dto);
            var emp = EmployeeAppService.GetByUpn(dto.SubmittedBy);

            var recipient = emp.EmailAddress;

            var notification = NotificationService.CreateNotification((int)NotificationTypes.EventRequestConfirmation, recipient, dict, "");
            _pendingEmails.Add(notification);

            if (needsCommsApproval)
            {
                string emailTo = GetEmailsForCommsAndReviewer();

                notification = NotificationService.CreateNotification((int)NotificationTypes.EventRequestAwaitingComms, emailTo, dict, "");
                _pendingEmails.Add(notification);
            }
            else
            {
                string emailTo = GetEmailsForCommsAndReviewer();

                notification = NotificationService.CreateNotification((int)NotificationTypes.EventRequestSubmitted, emailTo, dict, "");
                _pendingEmails.Add(notification);
            }
        }

        public EventRequestDto Approve(int id, string comment)
        {
            var entity = Repository.GetIncluding(id, this.Permissions.PermissionFilter, x => x.EventRequestAttendees);

            entity.CommsComment = comment;
            entity.ApprovedBy = EmployeeAppService.GetByUpn(Session.Principal.Upn)?.DisplayName;
            entity.ApprovedDate = DateTime.Now;
            entity.Status = EventRequestStatuses.UNASSIGNED;

            entity = Repository.Save(entity);

            var dto = PostMap(MapToDto(entity));
            var dict = GetEmailData(dto);
            var ccEmail = EmployeeAppService.GetByUpn(entity.SubmittedBy)?.EmailAddress;
            var notification = NotificationService.CreateNotification((int)NotificationTypes.EventRequestCommsApproved, "", dict, ccEmail);

            NotificationService.AddNotification(notification);

            return dto;
        }

        public EventRequestDto Deny(int id, string comment)
        {
            var entity = Repository.GetIncluding(id, this.Permissions.PermissionFilter, x => x.EventRequestAttendees);

            entity.CommsComment = comment;
            entity.ApprovedBy = EmployeeAppService.GetByUpn(Session.Principal.Upn)?.DisplayName;
            entity.ApprovedDate = DateTime.Now;
            entity.Status = EventRequestStatuses.DENIED_COMMS;

            entity = Repository.Save(entity);

            var dto = PostMap(MapToDto(entity));
            var dict = GetEmailData(dto);
            var ccEmail = EmployeeAppService.GetByUpn(entity.SubmittedBy)?.EmailAddress;

            var notification = NotificationService.CreateNotification((int)NotificationTypes.EventRequestDenied, "", dict, ccEmail);
            NotificationService.AddNotification(notification);

            return dto;
        }

        private string GetEmailsForCommsAndReviewer()
        {
            // Send notification to Comms and Ethics
            var emailTo = GetEmailsForRole(Roles.EventCOMMS);
            var tmpTo = GetEmailsForRole(Roles.EventReviewer);
            if (!string.IsNullOrEmpty(emailTo))
            {
                if (!string.IsNullOrEmpty(tmpTo))
                {
                    emailTo += "," + tmpTo;
                }
            }
            else if (!string.IsNullOrEmpty(tmpTo))
            {
                emailTo = tmpTo;
            }

            return emailTo;
        }

        private string GetEmailsForRole(string role, int? departmentId = null)
        {
            string[] roleGroups = _applicationRoles.GetRoleGroups(role);
            List<Employee> usersInRole = _employeeRepository.GetAllInGroups(roleGroups);

            if (departmentId != null)
            {
                usersInRole = usersInRole.Where(x => x.DepartmentId == departmentId).ToList();
            }

            //find the officeManager of that department
            string emailList = "";
            usersInRole.ForEach(x => emailList += x.EmailAddress + ",");
            emailList = emailList.TrimEnd(',');

            return emailList;
        }

        protected override void OnBeforeUpdate(CrudEventArgs<EventRequestDto, EventRequest> e)
        {
            var dto = e.Dto;
            _pendingEmails = new List<Notification>();

            if (dto.Status == EventRequestStatuses.UNASSIGNED && e.Entity.Status == EventRequestStatuses.DRAFT)
            {
                // Submitting
                HandleSubmission(e);
            } 
            else if (dto.Status.Contains("Closed") && !e.Entity.Status.Contains("Closed"))
            {
                if (Session.Principal.IsInRole(Roles.EventReviewer) || Session.Principal.IsInRole(Roles.EthicsAppAdmin))
                    dto.ClosedDate = DateTime.Now;
                else
                {
                    e.Cancel = true;
                    e.Msg = "Unable to close event request, you do not have permission to perform this action.";
                }
            }

            if (!string.IsNullOrEmpty(dto.AssignedToUpn) && e.Entity.AssignedToUpn != dto.AssignedToUpn)
            {
                // Attempting to assign to a new reviewer, if admin or reviewer, accept assignment, set status to Open, else return error
                if (Session.Principal.IsInRole(Roles.EventReviewer) || Session.Principal.IsInRole(Roles.EthicsAppAdmin))
                {
                    if (dto.Status == EventRequestStatuses.UNASSIGNED)
                        dto.Status = EventRequestStatuses.OPEN;

                    SendAssignmentEmail(dto);
                }
                else
                {
                    e.Cancel = true;
                    e.Msg = "Unable to assign event request, you do not have permission to perform this action.";
                }
            }
        }

        private void SendAssignmentEmail(EventRequestDto dto)
        {
            var dict = GetEmailData(dto);

            var reviewer = EmployeeAppService.GetByUpn(dto.AssignedToUpn);

            var notification = NotificationService.CreateNotification((int)NotificationTypes.EventRequestAssigned, reviewer.EmailAddress, dict, "");
            NotificationService.AddNotification(notification);
        }

        private EventRequestDto MapAttendeeEmployee(EventRequestDto dto)
        {
            var capacity = EventRequestCapacity.Personal;

            foreach (AttendeeDto att in dto.EventRequestAttendees)
            {
                if (!string.IsNullOrEmpty(att.EmployeeUpn))
                    att.Employee = EmployeeAppService.GetByUpn(att.EmployeeUpn);

                if (att.Capacity == EventRequestCapacity.Official)
                    capacity = att.Capacity;

                var attendeeAttachments = AttendeeAttachmentRepository.GetAll(x => x.EventRequestAttendeeId == att.Id);

                if (att.AttendeeAttachments == null)
                    att.AttendeeAttachments = new List<AttachmentDto>();

                foreach (var attach in attendeeAttachments)
                {
                    att.AttendeeAttachments.Add(Map(attach));
                }
            }

            dto.Capacity = capacity;

            return dto;
        }

        private AttachmentDto Map(AttendeeAttachment attach)
        {
            return ObjectMapper.Map<AttachmentDto>(attach);
        }

        public IEnumerable<EventRequestDto> GetByEmployee(string employeeUpn)
        {
            employeeUpn = employeeUpn.ToLower();
            var events = base.GetByIncluding(x => x.SubmittedBy.ToLower() == employeeUpn || x.CreatedBy.ToLower() == employeeUpn || x.EventRequestAttendees.Any(y => y.EmployeeUpn.ToLower() == employeeUpn), z => z.EventRequestAttachments, a => a.EventRequestAttendees);

            foreach (var e in events)
            {
                var attendeeString = "";

                foreach (var  a in e.EventRequestAttendees)
                {
                    attendeeString += a.EmployeeName + "; ";
                }

                e.AttendeesString = attendeeString.TrimEnd(';', ' ');
            }

            return events;
        }

        protected override void OnCreated(CrudEventArgs<EventRequestDto, EventRequest> e)
        {
            var attachments = EventRequestAttachmentRepository.GetAll(x => x.AttachedToGuid.ToString() == e.Dto.AttachmentGuid);

            if (e.Entity.EventRequestAttachments == null)
                e.Entity.EventRequestAttachments = new List<EventRequestAttachment>();

            attachments.ForEach(x => e.Entity.EventRequestAttachments.Add(x));

            // Map Attendee Attachments
            if (e.Entity.EventRequestAttendees != null)
            {
                foreach (var attendee in e.Entity.EventRequestAttendees)
                {
                    MapAttendeeAttachments(attendee);
                }
            }

            Repository.Save(e.Entity);

            foreach (var notification in _pendingEmails)
            {
                NotificationService.AddNotification(notification);
            }

            // just re-get the dto, otherwise subsequent updates w/o reloading get weird
            e.Dto = Get(e.Dto.Id);
            e.Dto = MapAttendeeEmployee(e.Dto);
        }

        private void MapAttendeeAttachments(EventRequestAttendee attendee)
        {
            var attAttachments = AttendeeAttachmentRepository.GetAll(x => x.AttachedToGuid.ToString() == attendee.AttachmentGuid);

            if (attendee.AttendeeAttachments == null)
                attendee.AttendeeAttachments = new List<AttendeeAttachment>();

            attAttachments.ForEach(x => attendee.AttendeeAttachments.Add(x));
        }

        public override EventRequestDto Update(EventRequestDto dto)
        {
            if (!Permissions.CanUpdate)
                throw new SecurityException("Access denied.  Cannot update object of type " + typeof(EventRequest).Name);

            var e = new CrudEventArgs<EventRequestDto, EventRequest>();
            var entity = Repository.GetIncluding(dto.Id, this.Permissions.PermissionFilter, x => x.EventRequestAttendees);

            e.Entity = entity;
            e.Dto = dto;

            OnBeforeUpdate(e);

            if (!e.Cancel)
            {
                //MapToEntity(dto, e.Entity);
                MapUpdates(e);

                Repository.Update(e.Entity);

                e.Dto = PostMap(MapToDto(e.Entity));

                OnUpdated(e);
            }

            return e.Dto;
        }

        private void MapUpdates(CrudEventArgs<EventRequestDto, EventRequest> e)
        {
            // Manually map updates from e.Dto to e.Entity
            // Using AutoMapper w/ child records results in deleted children

            // Map EventRequest
            var entity = e.Entity;
            var dto = e.Dto;

            entity.AdditionalInformation = dto.AdditionalInformation;
            entity.ApproximateAttendees = dto.ApproximateAttendees;
            entity.AssignedTo = dto.AssignedTo;
            entity.AssignedToUpn = dto.AssignedToUpn;
            entity.AttachmentGuid = dto.AttachmentGuid;
            entity.ClosedBy = dto.ClosedBy;
            entity.ClosedDate = dto.ClosedDate;
            entity.ClosedReason = dto.ClosedReason;
            entity.CrowdDescription = dto.CrowdDescription;
            entity.EventContactEmail = dto.EventContactEmail;
            entity.EventContactName = dto.EventContactName;
            entity.EventContactPhone = dto.EventContactPhone;
            entity.EventEndDate = dto.EventEndDate;
            entity.EventStartDate = dto.EventStartDate;
            entity.EventLocation = dto.EventLocation;
            entity.EventName = dto.EventName;
            entity.FairMarketValue = dto.FairMarketValue;
            entity.GuestsInvited = dto.GuestsInvited;
            entity.GuidanceGiven = dto.GuidanceGiven;
            entity.HostOther = dto.HostOther;
            entity.IndividualExtendingInvite = dto.IndividualExtendingInvite;
            entity.InternationalTravel = dto.InternationalTravel;
            entity.IsFundraiser = dto.IsFundraiser; 
            entity.IsHostLobbyist = dto.IsHostLobbyist;
            entity.IsIndividualLobbyist = dto.IsIndividualLobbyist;
            entity.IsOpenToMedia  = dto.IsOpenToMedia;
            entity.IsOrgLobbyist = dto.IsOrgLobbyist;
            entity.IsQAndA = dto.IsQAndA;
            entity.ModeratorsAndPanelists = dto.ModeratorsAndPanelists;
            entity.OrgExtendingInvite = dto.OrgExtendingInvite;
            entity.OrgHostingEvent = dto.OrgHostingEvent;
            entity.OrgOther = dto.OrgOther;
            entity.ReceivedInvitation = dto.ReceivedInvitation;
            entity.RequiresTravel = dto.RequiresTravel;
            entity.Status = dto.Status;
            entity.SubmittedBy = dto.SubmittedBy;
            entity.SubmittedDate = dto.SubmittedDate;
            entity.Submitter = dto.Submitter;
            entity.Title = dto.EventName + " (" + DateTime.Now.Year.ToString() + ")";
            entity.TypeOfHost = dto.TypeOfHost;
            entity.TypeOfOrg = dto.TypeOfOrg;   
            entity.WhatIsProvided = dto.WhatIsProvided;
            entity.WhoIsPaying = dto.WhoIsPaying;
            entity.ApprovedBy = dto.ApprovedBy;
            entity.ApprovedDate = dto.ApprovedDate;

            // Map Attendees
            //   Check for deleted attendees
            foreach (var ent in entity.EventRequestAttendees)
            {
                var att = dto.EventRequestAttendees.Where(x => x.Id == ent.Id).FirstOrDefault();

                if (att == null)
                    ent.IsDeleted = true;
            }

            foreach (var att in dto.EventRequestAttendees)
            {
                EventRequestAttendee ent = null;

                if (att.Id > 0)
                {
                    ent = entity.EventRequestAttendees.Where(x => x.Id == att.Id).FirstOrDefault();

                    if (ent != null)
                        MapAttendee(att, ent);
                }

                if (att.Id == 0 || ent == null)
                {
                    ent = new EventRequestAttendee();

                    MapAttendee(att, ent);
                    MapAttendeeAttachments(ent);

                    entity.EventRequestAttendees.Add(ent);
                }
            }
        }

        private void MapAttendee(AttendeeDto att, EventRequestAttendee ent)
        {
            ent.AttachmentGuid = att.AttachmentGuid;
            ent.Capacity = att.Capacity;
            ent.EmployeeName = att.EmployeeName;
            ent.EmployeeType = att.EmployeeType;
            ent.EmployeeUpn = att.EmployeeUpn;
            ent.InformedSupervisor = att.InformedSupervisor;
            ent.IsGivingRemarks = att.IsGivingRemarks;
            ent.IsSpeakerAgreementRequired = att.IsSpeakerAgreementRequired;
            ent.NameOfSupervisor = att.NameOfSupervisor;
            ent.ReasonForAttending = att.ReasonForAttending;
            ent.Remarks = att.Remarks;
        }

        protected override void OnUpdated(CrudEventArgs<EventRequestDto, EventRequest> e)
        {
            // just re-get the dto, otherwise we lose the attachments in the UI.
            e.Dto = Get(e.Dto.Id);

            e.Dto.EventRequestAttendees = e.Dto.EventRequestAttendees.Where(x => x.IsDeleted == false).ToList();

            foreach (var notification in _pendingEmails)
            {
                NotificationService.AddNotification(notification);
            }
        }

        public Dictionary<string, string> GetEmailData(EventRequestDto dto)
        {
            var user = Session.Principal;
            var dict = new Dictionary<string, string>();
            var settings = SettingsAppService.Get();

            dict = SettingsAppService.AppendEmailData(dict, settings);

            dict.Add("User", user.DisplayName);
            dict.Add("Email", user.EmailAddress);

            dict.Add("EventName", dto.EventName);
            dict.Add("EventStartDate", dto.EventStartDate.Value.ToShortDateString());
            dict.Add("EventEndDate", dto.EventEndDate.Value.ToShortDateString());
            dict.Add("EventLocation", dto.EventLocation);
            dict.Add("ApproximateAttendees", dto.ApproximateAttendees);
            dict.Add("CrowdDescription", dto.CrowdDescription);
            dict.Add("IsFundraiser", dto.IsFundraiser.HasValue && dto.IsFundraiser.Value ? "Yes" : "No");
            dict.Add("IsOpenToMedia", dto.IsOpenToMedia.HasValue && dto.IsOpenToMedia.Value ? "Yes" : "No");
            dict.Add("RequiresTravel", dto.RequiresTravel.HasValue && dto.RequiresTravel.Value ? "Yes" : "No");
            dict.Add("InternationalTravel", dto.InternationalTravel.HasValue && dto.InternationalTravel.Value ? "Yes" : "No");
            dict.Add("COMMSComment", dto.CommsComment);

            var travelForms = "";
            var invitations = "";
            var otherAttachments = "";

            foreach (AttachmentDto att in dto.EventRequestAttachments)
            {
                if (att.Type == EventRequestAttachmentTypes.TRAVEL_FORMS)
                    travelForms += att.Name + ", ";
                if (att.Type == EventRequestAttachmentTypes.INVITATIONS)
                    invitations += att.Name + ", ";
            }

            travelForms = travelForms.TrimEnd(new char[] { ',', ' ' });
            invitations = invitations.TrimEnd(new char[] { ',', ' ' });
            otherAttachments = otherAttachments.TrimEnd(new char[] { ',', ' ' });

            dict.Add("TravelForms", travelForms);

            var attendeeData = "";
            var attendeeString = "";

            foreach (AttendeeDto att in dto.EventRequestAttendees)
            {
                var data = "​​​​Name of Attendee: {0}<br />";

                data += "Has your supervisor been informed of this request?: {1}<br />";
                data += "Name of Supervisor: {2}<br />";
                data += "Political or Career Employee: {3}<br />";
                data += "Attending Capacity: {4}<br />";
                data += "Attendee Giving Remarks: {5}<br />";
                data += "Remarks: {6}<br />";
                data += "Reason for Attending: {7}";

                data = string.Format(data, new string[] {
                    ((att.Employee == null) ? att.EmployeeName : att.Employee.DisplayName),
                    (att.InformedSupervisor.HasValue && att.InformedSupervisor.Value ? "Yes" : "No"),
                    att.NameOfSupervisor ?? "",
                    att.EmployeeType ?? "",
                    att.Capacity ?? "",
                    (att.IsGivingRemarks.HasValue && att.IsGivingRemarks.Value ? "Yes" : "No"),
                    att.Remarks ?? "",
                    att.ReasonForAttending ?? ""});

                attendeeData += data + "<br /><br />";
                attendeeString += (att.Employee == null ? att.EmployeeName : att.Employee.DisplayName) + ", ";
            }

            if (attendeeData.Length > 12)
                attendeeData = attendeeData.Substring(0, attendeeData.Length - 12);

            attendeeString = attendeeString.TrimEnd(',', ' ');

            dict.Add("Attendees", attendeeData);
            dict.Add("AttendeeString", attendeeString);
            dict.Add("GuestsInvited", dto.GuestsInvited.HasValue && dto.GuestsInvited.Value ? "Yes" : "No");
            dict.Add("IndividualExtendingInvite", dto.IndividualExtendingInvite);
            dict.Add("IsIndividualLobbyist", dto.IsIndividualLobbyist.HasValue && dto.IsIndividualLobbyist.Value ? "Yes" : "No");
            dict.Add("OrgExtendingInvite", dto.OrgExtendingInvite);
            dict.Add("IsOrgLobbyist", dto.IsOrgLobbyist.HasValue && dto.IsOrgLobbyist.Value ? "Yes" : "No");
            dict.Add("TypeOfOrg", GetOrgDescription(dto.TypeOfOrg));
            dict.Add("OrgHostingEvent", dto.OrgHostingEvent);
            dict.Add("IsHostLobbyist", dto.IsHostLobbyist.HasValue && dto.IsHostLobbyist.Value ? "Yes" : "No");
            dict.Add("TypeOfHost", GetOrgDescription(dto.TypeOfHost));

            dict.Add("Invitations", invitations);

            dict.Add("EventContactName", dto.EventContactName);
            dict.Add("EventContactPhone", dto.EventContactPhone);
            dict.Add("EventContactEmail", dto.EventContactEmail);
            dict.Add("FairMarketValue", dto.FairMarketValue);
            dict.Add("WhoIsPaying", dto.WhoIsPaying);
            dict.Add("AdditionalInformation", dto.AdditionalInformation);
            dict.Add("AdditionalDocuments", otherAttachments);

            dict.Add("IsQAndA", dto.IsQAndA.HasValue && dto.IsQAndA.Value ? "Yes" : "No");
            dict.Add("ModeratorsAndPanelists", dto.ModeratorsAndPanelists);

            dict.Add("Submitter", dto.Submitter);

            dict.Add("ContactEmail", dto.ContactEmail);
            dict.Add("ContactNumber", dto.ContactNumber);
            dict.Add("ContactComponent", dto.ContactComponent);

            dict.Add("AssignedTo", dto.AssignedTo);

            return dict;
        }

        private string GetOrgDescription(int typeOfOrg)
        {
            var desc = "";

            if ((typeOfOrg & 1) == 1)
                desc += "Non-Profit/501(c)(3), ";
            if ((typeOfOrg & 2) == 2)
                desc += "Media Org., ";
            if ((typeOfOrg & 4) == 4)
                desc += "Lobbying Org., ";
            if ((typeOfOrg & 8) == 8)
                desc += "USG Entity, ";
            if ((typeOfOrg & 16) == 16)
                desc += "Foreign Gov., ";

            desc = desc.TrimEnd(new char[] { ',', ' ' });

            return desc;
        }

        //public Dictionary<string, string> GetEmailFieldsDef(Dictionary<string, string> dict)
        //{
        //    dict.Add("[User]", "The Display Name of the filer.");
        //    dict.Add("[Email]", "The filer's email address.");

        //    dict.Add("[EventName]", "The name of the event.");
        //    dict.Add("[EventStartDate]", "The start date of the event.");
        //    dict.Add("[EventEndDate]", "The end date of the event.");
        //    dict.Add("[EventLocation]", "The location of the event.");
        //    dict.Add("[ApproximateAttendees]", "The approximate number of attendees for the event.");
        //    dict.Add("[CrowdDescription]", "The description of the crowd at the event.");
        //    dict.Add("[IsFundraiser]", "Is the event a fundraiser?");
        //    dict.Add("[IsOpenToMedia]", "Is the event open to the media?");
        //    dict.Add("[IsQAndA]", "Will the event have a Q and A?");
        //    dict.Add("[ModeratorsAndPanelists]", "If panel discussion, list of moderators and panelists.");
        //    dict.Add("[RequiresTravel]", "Does the event require travel?");
        //    dict.Add("[InternationalTravel]", "Does the event require international travel?");
        //    dict.Add("[TravelForms]", "The attached travel forms.");

        //    dict.Add("[Attendees]", "Attendee information for the event.");
        //    dict.Add("[AttendeeString]", "Comma delimited list of attendees.");

        //    dict.Add("[GuestsInvited]", "Are guests invited?");
        //    dict.Add("[IndividualExtendingInvite]", "Individual extending the invite.");
        //    dict.Add("[IndividualLobbyist]", "Is this person a lobbyist?");
        //    dict.Add("[OrgExtendingInvite]", "Organization extending the invite.");
        //    dict.Add("[IsOrgLobbyist]", "Is this organization a lobbyist?");
        //    dict.Add("[TypeOfOrg]", "Type of organization.");
        //    dict.Add("[OrgHostingEvent]", "Organization hosting the event.");
        //    dict.Add("[IsHostLobbyist]", "Is the host a lobbyist.");
        //    dict.Add("[TypeOfHost]", "The type of oranization of the host.");
        //    dict.Add("[Invitations]", "The attached invitations.");

        //    dict.Add("[EventContactName]", "Person to contact at the event.");
        //    dict.Add("[EventContactPhone]", "The event contact's phone number.");
        //    dict.Add("[EventContactEmail]", "The event contact's email.");
        //    dict.Add("[FairMarketValue]", "The fair market value of the event.");
        //    dict.Add("[WhoIsPaying]", "The person paying for the event.");
        //    dict.Add("[AdditionalInformation]", "Additional information submitted.");
        //    dict.Add("[AdditionalDocuments]", "Any additional attachments.");

        //    dict.Add("[Submitter]", "The submitter of the event request.");
        //    dict.Add("[ContactEmail]", "The submitter's email.");
        //    dict.Add("[ContactNumber]", "The submitter's phone number.");
        //    dict.Add("[ContactComponent]", "The component of the submitter.");

        //    dict.Add("[AssignedTo]", "Who the event request was assigned to.");
        //    dict.Add("[COMMSComment]", "Comments left by COMMS.");

        //    return dict;
        //}

        public EventsRequestChart GetYearOverYearChart()
        {
            var data = new EventsRequestChart();
            data.Datasets = new List<DataSet>();

            var backgroundColors = new List<string>();
            var borderColors = new List<string>();

            //backgroundColors.Add("#f8f9fa");

            backgroundColors.Add("#337ab7");    // Primary
            backgroundColors.Add("#6c757d");    // Secondary
            backgroundColors.Add("#5cb85c");    // Success
            backgroundColors.Add("#d9534f");    // Error
            backgroundColors.Add("#f0ad4e");    // Warning
            backgroundColors.Add("#5bc0de");    // Info

            //borderColors.Add("#e6e7de");
            borderColors.Add("#236ba7");    // Primary
            borderColors.Add("#5a6268");    // Secondary
            borderColors.Add("#4cae4c");    // Success
            borderColors.Add("#d43f3a");    // Error
            borderColors.Add("#ec971f");    // Warning
            borderColors.Add("#46b8da");    // Info

            var thisYear = DateTime.Now.Year;
            var events = GetBy(x => x.EventStartDate.HasValue && x.EventStartDate.Value.Year >= thisYear - 5 && x.Status == EventRequestStatuses.APPROVED);
            
            var tmpEvent = events.OrderBy(x => x.EventStartDate.HasValue ? x.EventStartDate.Value.Year : 9999).FirstOrDefault();
            var historyYear = tmpEvent == null ? thisYear : tmpEvent.EventStartDate.Value.Year;

            data.Labels = new List<string>() { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

            for (int i = 0; historyYear <= thisYear; i++, historyYear++)
            {
                var set = new DataSet();

                var yearEvents = events.Where(x => (x.EventStartDate.HasValue ? x.EventStartDate.Value.Year : 0) == historyYear).ToList();

                set.Label = historyYear.ToString() + " (" + yearEvents.Count + ")";
                set.Data = new List<int>();
                set.BackgroundColor = backgroundColors[i % 6];
                set.BorderColor = borderColors[i % 6];
                set.Fill = false;

                for (int m = 1; m <= 12; m++)
                {
                    var monthEvents = yearEvents.Where(x => x.EventStartDate.Value.Month == m).ToList();
                    set.Data.Add(monthEvents.Count);
                }

                data.Datasets.Add(set);
            }

            return data;
        }

        public void ResendAssignmentEmail(int id)
        {
            var dto = Get(id);

            SendAssignmentEmail(dto);
        }
    }
}
