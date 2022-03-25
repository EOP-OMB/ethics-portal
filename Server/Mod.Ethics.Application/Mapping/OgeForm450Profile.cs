using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mod.Ethics.Application.Mapping
{
    public class OgeForm450Profile : AutoMapper.Profile
    {
        public OgeForm450Profile()
        {
            CreateMap<OgeForm450, OgeForm450Dto>()
                .ForMember(dto => dto.Filer, opt => opt.MapFrom(src => src.FilerUpn))
                .ForMember(dto => dto.ReportableInformationList, opt => opt.MapFrom(src => src.ReportableInformation))
                .ForMember(dto => dto.MailingAddress, opt => opt.MapFrom(src => src.SgeMailingAddress))
                .ForMember(dto => dto.ExtendedText, opt => opt.MapFrom(src => src.DaysExtended > 0 ? "Yes" : "No"))
                .ForMember(dto => dto.IsOverdue, opt => opt.MapFrom(src => IsOverdue(src)))
                .ForMember(dto => dto.IsUnchanged, opt => opt.MapFrom(src => (src.FormFlags & (int)OgeForm450Flags.Unchanged) == (int)OgeForm450Flags.Unchanged))
                .ForMember(dto => dto.SubmittedPaperCopy, opt => opt.MapFrom(src => (src.FormFlags & (int)OgeForm450Flags.SubmittedPaperCopy) == (int)OgeForm450Flags.SubmittedPaperCopy))
                .ForMember(dto => dto.FormFlags, opt => opt.Ignore())
                .AfterMap((src, dto) => FinalizeMap(src, dto));

            CreateMap<OgeForm450Dto, OgeForm450>()
                .BeforeMap((dto, entity) => BeforeMap(dto, entity))
                .ForMember(entity => entity.FilerUpn, opt => opt.MapFrom(dto => dto.Filer))
                .ForMember(entity => entity.ReportableInformation, opt => opt.MapFrom(dto => dto.ReportableInformationList))
                .ForMember(entity => entity.SgeMailingAddress, opt => opt.MapFrom(dto => dto.MailingAddress))
                .ForMember(entity => entity.DaysExtended, opt => opt.Ignore())      // Do not map DaysExtended, this is handled specifically upon Extension approval and not through Form Update
                .ForMember(entity => entity.FormFlags, opt => opt.MapFrom(dto => GetFormFlags(dto)));

            CreateMap<OgeForm450ReportableInformation, ReportableInformationDto>()
                .ForMember(dto => dto.InfoType, opt => opt.MapFrom(src => src.Type))
                .ReverseMap();
        }

        private static void BeforeMap(OgeForm450Dto dto, OgeForm450 entity)
        {
            // Check status, if dto.status != entity.status add the status record
            if (dto.FormStatus != entity.FormStatus)
            {
                var newStatus = new OgeForm450Status() { Status = dto.FormStatus };

                if (newStatus.Status == OgeForm450Statuses.CERTIFIED)
                {
                    //newStatus.Comment = dto.CommentsOfReviewingOfficial;
                    newStatus.CreatedBy = dto.ReviewingOfficialSignature;
                }
                else if (newStatus.Status == OgeForm450Statuses.MISSING_INFORMATION)
                {
                    newStatus.Comment = dto.RejectionNotes;
                }
                else if (newStatus.Status == OgeForm450Statuses.SUBMITTED || newStatus.Status == OgeForm450Statuses.RE_SUBMITTED)
                {
                    newStatus.CreatedBy = dto.EmployeeSignature;
                }

                entity.OgeForm450Statuses.Add(newStatus);
            }
        }

        private static int GetFormFlags(OgeForm450Dto dto)
        {
            var flags = 0;

            if (dto.SubmittedPaperCopy && (dto.FormStatus == OgeForm450Statuses.SUBMITTED || dto.FormStatus == OgeForm450Statuses.RE_SUBMITTED || dto.FormStatus == OgeForm450Statuses.CERTIFIED))
            {
                flags += (int)OgeForm450Flags.SubmittedPaperCopy;
                dto.SubmittedPaperCopy = true;
            }
            else
                dto.SubmittedPaperCopy = false;

            if (dto.IsUnchanged)
                flags += (int)OgeForm450Flags.Unchanged;

            return flags;
        }

        private static void FinalizeMap(OgeForm450 src, OgeForm450Dto dto)
        {
            if (src.OgeForm450Statuses != null)
            {
                var statuses = src.OgeForm450Statuses.ToList();

                dto.DateReceivedByAgency = GetStatusDate(OgeForm450Statuses.SUBMITTED, statuses);
                dto.DateOfEmployeeSignature = dto.DateReceivedByAgency;
                dto.DateOfReviewerSignature = GetStatusDate(OgeForm450Statuses.CERTIFIED, statuses);
                dto.ReSubmittedDate = GetStatusDate(OgeForm450Statuses.RE_SUBMITTED, statuses);
                dto.DateCanceled = GetStatusDate(OgeForm450Statuses.CANCELED, statuses);

                dto.ReviewingOfficialSignature = GetStatusBy(OgeForm450Statuses.CERTIFIED, statuses);
                dto.EmployeeSignature = GetStatusBy(OgeForm450Statuses.SUBMITTED, statuses);
                //dto.CommentsOfReviewingOfficial = GetStatusComments(OgeForm450Statuses.CERTIFIED, statuses);
            }

            var flags = "";

            dto.IsBlank = !(dto.HasAssetsOrIncome || dto.HasLiabilities || dto.HasOutsidePositions || dto.HasAgreementsOrArrangements || dto.HasGiftsOrTravelReimbursements) && !dto.SubmittedPaperCopy && (dto.FormStatus == OgeForm450Statuses.SUBMITTED || dto.FormStatus == OgeForm450Statuses.RE_SUBMITTED || dto.FormStatus == OgeForm450Statuses.CERTIFIED);

            if (dto.SubmittedPaperCopy && (dto.FormStatus == OgeForm450Statuses.SUBMITTED || dto.FormStatus == OgeForm450Statuses.RE_SUBMITTED || dto.FormStatus == OgeForm450Statuses.CERTIFIED))
            {
                flags += OgeForm450TextFlags.PAPER_COPY + "|";
                dto.SubmittedPaperCopy = true;
            }
            else
                dto.SubmittedPaperCopy = false;

            if (dto.DaysExtended > 0)
                flags += OgeForm450TextFlags.EXTENDED + "|";

            if (dto.IsBlank)
                flags += OgeForm450TextFlags.BLANK_SUBMISSION + "|";

            if (dto.IsOverdue)
                flags += OgeForm450TextFlags.OVERDUE + "|";

            if (dto.IsUnchanged)
                flags += OgeForm450TextFlags.UNCHANGED + "|";

            dto.FormFlags = flags;
        }

        private static bool IsOverdue(OgeForm450 src)
        {
            var status = src.FormStatus;

            return src.DueDate < DateTime.Now && (status == OgeForm450Statuses.DRAFT || status == OgeForm450Statuses.NOT_STARTED || status == OgeForm450Statuses.MISSING_INFORMATION);
        }

        // Needs Work
        //public List<ReportableInformationDto> ReportableInformationList { get; set; }

        public string FormFlags { get; set; }  //Text representation of Flags and other statuses 

        private static DateTime? GetStatusDate(string status, IEnumerable<OgeForm450Status> statuses)
        {
            var ogeForm450Status = GetFirstByStatus(status, statuses);

            return ogeForm450Status?.CreatedTime;
        }

        private static string GetStatusBy(string status, IEnumerable<OgeForm450Status> statuses)
        {
            var ogeForm450Status = GetFirstByStatus(status, statuses);

            return ogeForm450Status?.CreatedBy;
        }

        private static string GetStatusComments(string status, IEnumerable<OgeForm450Status> statuses)
        {
            var ogeForm450Status = GetFirstByStatus(status, statuses);

            return ogeForm450Status?.Comment;
        }

        private static OgeForm450Status GetFirstByStatus(string status, IEnumerable<OgeForm450Status> statuses)
        {
            return statuses.Where(x => x.Status == status).OrderByDescending(x => x.CreatedTime).FirstOrDefault();
        }
    }
}
