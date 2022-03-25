using Mod.Ethics.Domain.Entities;
using Mod.Framework.Domain.Repositories;

namespace Mod.Ethics.Domain.Interfaces
{
    public interface IOgeForm450Repository : IRepository<OgeForm450>
    {
        OgeForm450 GetPreviousForm(int year, string upn);
    }
}
