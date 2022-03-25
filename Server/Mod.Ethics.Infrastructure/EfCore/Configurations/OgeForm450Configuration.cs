using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mod.Ethics.Domain.Entities;

namespace Mod.Ethics.Infrastructure.EfCore.Configurations
{
    public class OgeForm450Configuration : IEntityTypeConfiguration<OgeForm450>
    {
        public void Configure(EntityTypeBuilder<OgeForm450> builder)
        {
            builder.Property(e => e.FilerUpn).HasMaxLength(100);
            builder.Property(e => e.ReportingStatus).HasMaxLength(50);
            builder.Property(e => e.FormStatus).HasMaxLength(50);
            builder.Property(e => e.EmployeesName).HasMaxLength(50);
            builder.Property(e => e.EmailAddress).HasMaxLength(50);
            builder.Property(e => e.PositionTitle).HasMaxLength(100);
            builder.Property(e => e.Grade).HasMaxLength(50);
            builder.Property(e => e.Agency).HasMaxLength(150);
            builder.Property(e => e.WorkPhone).HasMaxLength(50);

            builder.HasIndex(i => i.FilerUpn);

            builder.Ignore(e => e.IsReviewable);
        }
    }
}
