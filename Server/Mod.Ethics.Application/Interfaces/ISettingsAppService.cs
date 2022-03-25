using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Services
{
    public interface ISettingsAppService : ICrudAppService<SettingsDto, Settings>
    {
        SettingsDto Get();
        Dictionary<string, string> AppendEmailData(Dictionary<string, string> dict, SettingsDto dto);
        Dictionary<string, string> AppendEmailFieldsDef(Dictionary<string, string> dict);
    }
}
