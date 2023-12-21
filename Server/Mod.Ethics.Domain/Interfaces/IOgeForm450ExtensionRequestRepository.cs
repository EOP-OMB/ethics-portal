using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Views;
using Mod.Framework.Domain.Repositories;
using System.Linq;

namespace Mod.Ethics.Domain.Interfaces
{
    public interface IOgeForm450ExtensionRequestRepository : IRepository<OgeForm450ExtensionRequest>
    {
        public IQueryable<ExtensionRequestTable> QueryTable();
    }
}
