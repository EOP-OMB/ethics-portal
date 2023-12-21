using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.Attachments.Dtos;

namespace Mod.Ethics.Application.Services
{
    public interface IAttendeeAttachmentAppService : ICrudAppService<AttachmentDto, AttendeeAttachment>
    {
    }
}
