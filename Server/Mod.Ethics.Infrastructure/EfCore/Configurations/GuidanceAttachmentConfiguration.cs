using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Infrastructure.EfCore.Configurations
{
    public class GuidanceAttachmentConfiguration : IEntityTypeConfiguration<GuidanceAttachment>
    {
        public void Configure(EntityTypeBuilder<GuidanceAttachment> builder)
        {
            builder.HasOne(x => x.Guidance).WithMany(z => z.Attachments);
        }
    }
}
