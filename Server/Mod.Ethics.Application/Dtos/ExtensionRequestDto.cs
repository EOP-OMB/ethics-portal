using Mod.Framework.Application;
using Mod.Framework.Runtime.Security;
using System;
using System.Collections.Generic;

namespace Mod.Ethics.Application.Dtos
{
    public class ExtensionRequestDto : AuditedDtoBase
    {
        public int OGEForm450Id { get; set; }
        public string Reason { get; set; }
        public int DaysRequested { get; set; }
        public string Status { get; set; }
        public DateTime ExtensionDate { get; set; }

        public string ReviewerComments { get; set; }

        public string FilerName { get; set; }
        public string Year { get; set; }
        public DateTime DueDate { get; set; }

        public OgeForm450Dto Form { get; set; }
    }
}
