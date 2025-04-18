﻿using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Services
{
    public class SettingsAppService : CrudAppService<SettingsDto, Settings>, ISettingsAppService
    {
        private bool IN_MAINTENANCE_MODE;

        public SettingsAppService(ISettingsRepository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            this.IN_MAINTENANCE_MODE = false;
        }

        public SettingsDto Get()
        {
            var settings = this.GetAll().ToList();

            if (settings != null && settings.Count > 0)
                return settings[0];
            else
                return null;
        }

        public Dictionary<string, string> AppendEmailData(Dictionary<string, string> dict, SettingsDto dto)
        {
            dict.Add("SiteUrl", dto.SiteUrl);
            dict.Add("SiteEmail", dto.OGCEmail);
            dict.Add("Cc", dto.CcEmail);

            return dict;
        }

        public Dictionary<string, string> AppendEmailFieldsDef(Dictionary<string, string> dict)
        {
            dict.Add("[SiteUrl]", "The Site URL from Settings.");
            dict.Add("[SiteEmail]", "The Site Email from Settings.");
            dict.Add("[Cc]", "The CC Email from Settings.");

            return dict;
        }
    }
}
