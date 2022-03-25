using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class EoyReportDto
    {
        public int  Year { get; set; }

        public int RequiredForms { get; set; }
        public int FiledAlternativeForms { get; set; }  // Electronically Certified
        public int FiledForms { get; set; }             // Paper Forms

        public  int NumberOfElectronicFilers { get; set; }  // Not Forms, unique individuals who filed electronically

        public int CertifiedOrClosed { get; set; }
        public int ReviewedIn60Days { get; set; }
        public int CertifiedIn60Days { get; set; }

        public List<OgeForm450Dto> ClosedReports { get; set; }
        public List<OgeForm450Dto> NotReviewedIn60Days { get; set; }
        public List<OgeForm450Dto> NotCertifiedIn60Days { get; set; }
        public List<OgeForm450Dto> RequiredVsFiled { get; set; }
        public List<OgeForm450Dto> NonYearFilings { get; set; }

    }
}
