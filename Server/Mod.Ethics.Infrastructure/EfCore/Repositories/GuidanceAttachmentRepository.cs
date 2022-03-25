using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Attachments.Entities;
using Mod.Framework.Attachments.Interfaces;
using Mod.Framework.EfCore.Repositories;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class GuidanceAttachmentRepository : EfRepositoryBase<EthicsContext, GuidanceAttachment>, IGuidanceAttachmentRepository
    {
        public GuidanceAttachmentRepository(EthicsContext context) : base(context)
        {
        }
    }
}
