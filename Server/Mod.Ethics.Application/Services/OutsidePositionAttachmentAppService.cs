﻿using Microsoft.Extensions.Logging;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Attachments.Dtos;
using Mod.Framework.Runtime.Session;


namespace Mod.Ethics.Application.Services
{
    public class OutsidePositionAttachmentAppService : CrudAppService<AttachmentDto, OutsidePositionAttachment>, IOutsidePositionAttachmentAppService
    {
        public OutsidePositionAttachmentAppService(IOutsidePositionAttachmentRepository repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
        }
    }
}
