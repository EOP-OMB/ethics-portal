using Mod.Ethics.Domain.Entities;
using System;

namespace Mod.Ethics.Domain.Views
{
    public class ExtensionRequestTable
    {
        public int Id { get; set; }
        public string FilerName { get; set; }
        public int Year { get; set; }
        public int DaysRequested { get; set; }
        public string Status { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime DueDate { get; set; }
        public int OgeForm450Id { get; set; }
        public OgeForm450 Form { get; set; }
        public string Reason { get; set; }
        public string Comments { get; set; }
        public DateTime ExtensionDate { get; set; }
    }
}
