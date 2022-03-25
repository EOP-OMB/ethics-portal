using Mod.Framework.Application;
using Mod.Framework.User.Entities;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Mod.Ethics.Application.Services
{
    public interface IExtensionRequestAppService : ICrudAppService<ExtensionRequestDto, OgeForm450ExtensionRequest>, IEmailData<ExtensionRequestDto>
    {
        List<ExtensionRequestDto> GetPending();
    }
}
