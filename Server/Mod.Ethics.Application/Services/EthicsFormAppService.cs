using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.Runtime.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security;

namespace Mod.Ethics.Application.Services
{
    public class EthicsFormAppService : CrudAppService<EthicsFormDto, EthicsForm>, IEthicsFormAppService
    {
        public EthicsFormAppService(IEthicsFormRepository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            
        }

        public override EthicsFormDto Get(int id)
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(EthicsForm).Name);

            var entity = Repository.Get(id, this.Permissions.PermissionFilter);

            var dto = PostMap(MapToDto(entity));

            dto.Bytes = entity.Content;

            return dto;
        }

        public override IEnumerable<EthicsFormDto> GetAll()
        {
            return base.GetAll().OrderBy(x => x.SortOrder);
        }

        public override IEnumerable<EthicsFormDto> GetBy(Expression<Func<EthicsForm, bool>> predicate)
        {
            return base.GetBy(predicate).OrderBy(x => x.SortOrder);
        }
    }
}
