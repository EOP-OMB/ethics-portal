using Microsoft.EntityFrameworkCore;
//using Mod.Ethics.Domain.Entities;
using Mod.Framework.EfCore;

using System.Reflection;
using Mod.Framework.Runtime.Session;
using Mod.Framework.Notifications.Domain.Entities;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Attachments.Entities;

namespace Mod.Ethics.Infrastructure.EfCore
{
    public class EthicsContext : ModDbContext<EthicsContext>
    {
        public DbSet<OgeForm450> OgeForm450s { get; set; }
        public DbSet<OgeForm450ExtensionRequest> OgeForm450ExtensionRequests { get; set; }
        public DbSet<OgeForm450ReportableInformation> OgeForm450ReportableInformation { get; set; }
        public DbSet<OgeForm450Status> OgeForm450Statuses { get; set; }

        public DbSet<EthicsForm> EthicsForms { get; set; }
        public DbSet<EthicsTeam> EthicsTeams { get; set; }
        public DbSet<EventRequest> EventRequests { get; set; }
        public DbSet<Training> Trainings { get; set; }
        public DbSet<Settings> Settings { get; set; }

        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationTemplate> NotificationTemplates { get; set; }
        public DbSet<NotificationStatus> NotificationStatuses { get; set; }

        public DbSet<HelpfulLink> HelpfulLinks { get; set; }

        public DbSet<Guidance> Guidance { get; set; }
        public DbSet<GuidanceSubject> GuidanceSubjects { get; set; }
        public DbSet<GuidanceType> GuidanceTypes { get; set; }

        public DbSet<GuidanceAttachment> GuidanceAttachments { get; set; }

        public EthicsContext(DbContextOptions<EthicsContext> options, IModSession session)
        : base(options)
        {
            ModSession = session;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(modelBuilder);
        }
    }
}
