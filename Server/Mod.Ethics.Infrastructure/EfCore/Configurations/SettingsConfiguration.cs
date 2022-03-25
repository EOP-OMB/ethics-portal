using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mod.Ethics.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Infrastructure.EfCore.Configurations
{
    public class SettingsConfiguration : IEntityTypeConfiguration<Settings>
    {
        public void Configure(EntityTypeBuilder<Settings> builder)
        {
            builder.Property(e => e.SiteUrl).HasMaxLength(50);
            builder.Property(e => e.OGCEmail).HasMaxLength(50);
            builder.Property(e => e.CcEmail).HasMaxLength(50);
            builder.Property(e => e.FormVersion).HasMaxLength(50);
            builder.Property(e => e.ReplacesVersion).HasMaxLength(50);
        }
    }
}
