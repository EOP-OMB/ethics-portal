using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.Runtime.Session;
using System.Collections.Generic;
using System.Linq;

namespace Mod.Ethics.Application.Services
{
    public class ReportAppService : AppService, IReportAppService
    {
        public IOgeForm450Repository Repository { get; private set; }
        public IEmployeeListAppService EmployeeRepository { get; private set; }
        public IOgeForm450AppService Service { get; private set; }

        public ReportAppService(IOgeForm450AppService service, IOgeForm450Repository repository, IEmployeeListAppService employeeRepository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(objectMapper, logger, session)
        {
            Repository = repository;
            EmployeeRepository = employeeRepository;
            Service = service;
        }

        public EoyReportDto GetEoyReport(int year)
        {
            var employees = EmployeeRepository.GetAllIncludeInactive();
            List<OgeForm450Dto> forms;
            IEnumerable<OgeForm450Dto> canceledForms;
            LoadReportForms(year, out forms, out canceledForms);

            var report = new EoyReportDto();

            //  In the list of closed reports, include those that were cancelled or expired after they were due (unless they were erroneously assigned),
            //  but not any that were canceleled before they were due.  We don't need to include reports that were cancelled or expired during the mass
            //  assignment of annual reports, since those were all re-assigned.
            ProcessClosedReports(employees, forms, canceledForms, report);

            var unique = forms.Select(x => new { upn = x.Filer }).Distinct();
            report.NumberOfElectronicFilers = unique.Count();

            report.RequiredForms = forms.Where(x => x.DueDate.Year >= year).Count();

            List<OgeForm450Dto> filedAlternativeForms = GetFiledAlternativeForms(year, forms);
            report.FiledAlternativeForms = filedAlternativeForms.Count();

            var filedForms = GetFiledForms(year, forms);
            report.FiledForms = filedForms.Count();

            var filedIds = filedAlternativeForms.Select(x => x.Id).ToList();
            filedIds.AddRange(filedForms.Select(x => x.Id).ToList());

            var notFiled = forms.Where(x => !filedIds.Contains(x.Id)).ToList();
            report.RequiredVsFiled = notFiled;

            report.NonYearFilings = GetNonYearFilings(year, forms);

            var certifiedOrClosed = GetCertifiedOrClosed(year, forms);

            report.CertifiedOrClosed = certifiedOrClosed.Count();

            report.ReviewedIn60Days = GetReviewedIn60DaysCount(certifiedOrClosed);
            report.CertifiedIn60Days = GetCertifiedIn60DaysCount(certifiedOrClosed);

            report.NotReviewedIn60Days = GetNotReviewedList(certifiedOrClosed);
            report.NotCertifiedIn60Days = GetNotCertifiedList(certifiedOrClosed);

            report.Year = year;

            return report;
        }

        private void LoadReportForms(int year, out List<OgeForm450Dto> forms, out IEnumerable<OgeForm450Dto> canceledForms)
        {
            //var forms = Repository.GetAllIncluding(x => x.DueDate.Year == year && !x.FormStatus.ToLower().Contains("expired"), y => y.OgeForm450Statuses);
            forms = Service.GetBy(x => (x.DueDate.Year == year || x.DueDate.Year == year + 1 || x.DueDate.Year == year - 1) && !x.FormStatus.ToLower().Contains("expired") && x.FormStatus != OgeForm450Statuses.CANCELED).ToList();
            canceledForms = Service.GetBy(x => x.DueDate.Year == year && !x.FormStatus.ToLower().Contains("expired") && x.FormStatus == OgeForm450Statuses.CANCELED);

            // Widdle down forms to either Due this year or filed this year
            forms = forms.Where(x => x.DueDate.Year == year ||
                                    (x.DateReceivedByAgency != null && x.DateReceivedByAgency.Value.Year == year && !x.SubmittedPaperCopy) ||
                                    (x.DateOfReviewerSignature != null && x.DateOfReviewerSignature.Value.Year == year && x.SubmittedPaperCopy)).ToList();

            // Remove forms that were due this year but filed last year
            var certifiedLastYearIds = forms.Where(x => x.DateReceivedByAgency != null && x.DateReceivedByAgency.Value.Year == year - 1 && x.FormStatus == OgeForm450Statuses.CERTIFIED).Select(x => x.Id).ToList();
            forms = forms.Where(x => !certifiedLastYearIds.Contains(x.Id)).ToList();
        }

        private static List<OgeForm450Dto> GetNotCertifiedList(List<OgeForm450Dto> certifiedOrClosed)
        {
            return certifiedOrClosed.Where(x => !(x.DateReceivedByAgency != null && x.DateOfReviewerSignature <= x.DateReceivedByAgency.Value.AddDays(60) || x.DateCanceled <= x.DateReceivedByAgency?.AddDays(60))).ToList();
        }

        private static List<OgeForm450Dto> GetNotReviewedList(List<OgeForm450Dto> certifiedOrClosed)
        {
            return certifiedOrClosed.Where(x => !(x.DateReceivedByAgency != null && x.DateOfSubstantiveReview != null && x.DateOfSubstantiveReview <= x.DateReceivedByAgency.Value.AddDays(60))).ToList();
        }

        private static int GetCertifiedIn60DaysCount(List<OgeForm450Dto> certifiedOrClosed)
        {
            return certifiedOrClosed.Count(x => x.DateReceivedByAgency != null && x.DateOfReviewerSignature <= x.DateReceivedByAgency.Value.AddDays(60) || x.DateCanceled <= x.DateReceivedByAgency?.AddDays(60));
        }

        private static int GetReviewedIn60DaysCount(List<OgeForm450Dto> certifiedOrClosed)
        {
            return certifiedOrClosed.Count(x => x.DateReceivedByAgency != null && x.DateOfSubstantiveReview != null && x.DateOfSubstantiveReview <= x.DateReceivedByAgency.Value.AddDays(60));
        }

        private static List<OgeForm450Dto> GetCertifiedOrClosed(int year, List<OgeForm450Dto> forms)
        {
            return forms.Where(x =>
                                                                (x.FormStatus == OgeForm450Statuses.CERTIFIED && x.DateOfReviewerSignature != null && x.DateOfReviewerSignature.Value.Year == year) ||
                                                                (x.FormStatus == OgeForm450Statuses.CANCELED && x.DateCanceled != null && x.DateCanceled.Value.Year == year)
                                                           ).ToList();
        }

        private static List<OgeForm450Dto> GetNonYearFilings(int year, List<OgeForm450Dto> forms)
        {
            return forms.Where(x => x.DueDate.Year != year && x.FormStatus == OgeForm450Statuses.CERTIFIED).ToList();
        }

        private static List<OgeForm450Dto> GetFiledForms(int year, List<OgeForm450Dto> forms)
        {
            return forms.Where(x => x.DateOfReviewerSignature != null && x.DateOfReviewerSignature.Value.Year == year && x.SubmittedPaperCopy && x.FormStatus == OgeForm450Statuses.CERTIFIED).ToList();
        }

        private static List<OgeForm450Dto> GetFiledAlternativeForms(int year, List<OgeForm450Dto> forms)
        {

            // Based off Submitted Date not Due Date.
            // 
            return forms.Where(x => x.DateReceivedByAgency != null && x.DateReceivedByAgency.Value.Year == year && !x.SubmittedPaperCopy && x.FormStatus == OgeForm450Statuses.CERTIFIED).ToList();
        }

        private static void ProcessClosedReports(List<EmployeeListDto> employees, List<OgeForm450Dto> forms, IEnumerable<OgeForm450Dto> canceledForms, EoyReportDto report)
        {
            report.ClosedReports = new List<OgeForm450Dto>();
            foreach (OgeForm450Dto form in canceledForms)
            {
                var employee = employees.Where(x => x.Upn.ToLower() == form.Filer.ToLower()).FirstOrDefault();

                if (employee != null)
                {
                    // Include those that were due before an employee left OMB
                    if (form.DueDate < employee.InactiveDate)
                    {
                        // Unless it was cancled in error and employee was reassigned a form.
                        var reassignedForm = forms.Where(x => x.Filer.ToLower() == employee.Upn.ToLower() && x.Year == form.Year).FirstOrDefault();

                        if (reassignedForm == null)
                        {
                            forms.Add(form);
                            report.ClosedReports.Add(form);
                        }
                    }
                }
            }
        }
    }
}
