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
    public class OgeForm450ExtensionRequestConfiguration : IEntityTypeConfiguration<OgeForm450ExtensionRequest>
    {
        public void Configure(EntityTypeBuilder<OgeForm450ExtensionRequest> builder)
        {
            builder.Property(e => e.Status).HasMaxLength(50);
        }
    }
}
