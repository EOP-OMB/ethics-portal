using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Infrastructure.EfCore.Configurations
{
    internal class GuidanceConfiguration : IEntityTypeConfiguration<Guidance>
    {
        public void Configure(EntityTypeBuilder<Guidance> builder)
        {
            builder.Ignore(e => e.Guid);
        }
    }
}