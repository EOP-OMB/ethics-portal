using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Services
{
    public interface IHelpfulLinkAppService : ICrudAppService<HelpfulLinkDto, HelpfulLink>
    {
    }
}
    