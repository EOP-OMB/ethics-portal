using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Application.Services;
using Mod.Ethics.Domain.Entities;
using Mod.Framework.Application;
using Mod.Framework.WebApi.Controllers;
using System;
using System.Collections.Generic;
using System.IO;

namespace Mod.Ethics.WebApi.Controllers
{
    [Authorize]
    public class ReportController : ModControllerBase
    {
        new readonly IReportAppService Service;

        public ReportController(ILogger<ReportController> logger, IReportAppService service) : base(logger, service)
        {
            Service = service;
        }

        [HttpGet("EoyReport/{year}")]
        public ActionResult GetEoyReport(int year)
        {
            var report = Service.GetEoyReport(year);

            return Json(report);
        }


        // TODO: Move to ReportApp Service?
        private ActionResult GenerateMissingTrainingReport(string year)
        {
            //var stream = new MemoryStream();
            //var writer = new StreamWriter(stream);

            return Ok();

            // TODO:  How to do this in dotnetcore?

            //int tmp = 0;
            //var currentYear = DateTime.Now.Year;

            //if (int.TryParse(year, out tmp))
            //    currentYear = Convert.ToInt32(year);

            //var employees = Employee.GetAll().Where(x => x.Inactive == false && (!x.AccountCreatedDate.HasValue || x.AccountCreatedDate.Value.Year <= currentYear)).ToList();
            //var trainings = Data.SharePoint.Models.Training.GetAllBy("Year", currentYear);
            //var allTrainings = Data.SharePoint.Models.Training.GetAll().Where(x => x.Year <= currentYear);

            //employees = employees.Where(x => trainings.Find(train => train.Employee.ToLower() == x.AccountName.ToLower()) == null).ToList();

            //var ldapEmployees = Employee.GetEmployeesFromLDAP(employees).ToList();

            //Logger.Log("test", "training", "ns", "GenerateMissingTrainingReport", "Employee Count: " + ldapEmployees.Count().ToString(), "Info", DateTime.Now);

            //writer.Write("Employee, Email, Last Training Date" + Environment.NewLine);
            //foreach (Employee emp in employees)
            //{
            //    var lastTrainingDate = "";
            //    var lastTraining = allTrainings.Where(x => x.Employee == emp.AccountName).OrderByDescending(x => x.DateAndTime).FirstOrDefault();

            //    if (lastTraining != null)
            //        lastTrainingDate = lastTraining.DateAndTime.ToString();
            //    else
            //        lastTrainingDate = "N/A";

            //    var ldapEmp = ldapEmployees.Where(x => x.AccountName.ToLower() == emp.AccountName.ToLower()).FirstOrDefault();
            //    if (ldapEmp != null)
            //        emp.EmailAddress = ldapEmp.EmailAddress;

            //    writer.Write(string.Format("\"{0}\", {1}, {2}" + Environment.NewLine, emp.DisplayName, emp.EmailAddress, lastTrainingDate));
            //}

            //writer.Flush();
            //stream.Position = 0;
            //var filename = currentYear.ToString() + " Missing Training Report.csv";

            //var fr = new FileResult(stream, Request, filename, "text/csv");

            //return fr;

            //HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            //result.Content = new StreamContent(stream);
            //result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
            //result.Content.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");
            //result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = currentYear.ToString() + " Missing Training Report.csv" };

            //return ResponseMessage(result);
        }
    }
}
