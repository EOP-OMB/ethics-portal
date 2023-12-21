using Microsoft.AspNetCore.Mvc;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Interfaces
{
    public interface IOutsidePositionAppService : ICrudAppService<OutsidePositionDto, OutsidePosition>
    {
        List<OutsidePositionDto> GetMyPositions();

        List<OutsidePositionDto> GetByEmployee(string upn);

        OutsidePositionDto Submit(OutsidePositionDto dto);
        OutsidePositionDto Approve(OutsidePositionDto dto);
        OutsidePositionDto Disapprove(OutsidePositionDto dto);
        OutsidePositionDto Cancel(OutsidePositionDto dto);
        OutsidePositionSummary GetSummary();
    }
}
