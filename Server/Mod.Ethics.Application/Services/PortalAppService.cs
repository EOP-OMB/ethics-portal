using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Interfaces;
using Mod.Ethics.Domain.Enumerations;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Runtime.Session;
using System;
using System.Linq;

namespace Mod.Ethics.Application.Services
{
    public class PortalAppService : AppService, IPortalAppService
    {
        IOgeForm450AppService FormService { get; set; }
        IEventRequestAppService EventService { get; set; }
        ITrainingAppService TrainingService { get; set; }
        IOutsidePositionAppService PositionService { get; set; }
        public PortalAppService(IOgeForm450AppService formService, IEventRequestAppService eventService, ITrainingAppService trainingService, IOutsidePositionAppService positionService, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(objectMapper, logger, session)
        {
            FormService = formService;
            EventService = eventService;
            TrainingService = trainingService;
            PositionService  = positionService;
        }

        public virtual PortalDto Get()
        {
            var current450 = FormService.GetCurrentForm();
            var myTraining = TrainingService.GetMyTraining();
            var myEvents = EventService.GetMyEvents();
            var myPositions = PositionService.GetMyPositions();

            var dto = new PortalDto();

            dto.Id = current450 == null ? 0 : current450.Id;
            dto.Current450Status = current450 == null ? null : current450.FormStatus;
            dto.IsOverdue = current450 == null ? false : current450.IsOverdue;
            
            var currentTraining = myTraining.Where(x => x.TrainingType == TrainingType.Annual && x.Year == DateTime.Now.Year).FirstOrDefault();

            dto.CurrentTrainingId = currentTraining == null ? 0 : currentTraining.Id;

            var pendingEvents = myEvents.Where(x => x.Status.Contains("Open")).ToList();

            dto.PendingEvents = pendingEvents.Count();

            var pendingPositions = myPositions.Where(x => x.Status == OutsidePositionStatuses.AWAITING_MANAGER || x.Status == OutsidePositionStatuses.AWAITING_ETHICS).ToList();

            dto.PendingPositions = pendingPositions.Count();

            return dto;
        }
    }
}
