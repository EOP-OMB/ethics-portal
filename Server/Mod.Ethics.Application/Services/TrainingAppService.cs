using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
using Mod.Ethics.Application.Constants;
using Mod.Ethics.Application.Dtos;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Framework.Application;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.Runtime.Session;
using Mod.Framework.User.Entities;
using Mod.Framework.User.Interfaces;
using Mod.Framework.User.Repositories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security;

namespace Mod.Ethics.Application.Services
{
    public class TrainingAppService : CrudAppService<TrainingDto, Training>, ITrainingAppService
    {
        IEmployeeRepository EmployeeRepository;

        public TrainingAppService(ITrainingRepository repository, IEmployeeRepository employeeRepo, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
            EmployeeRepository = employeeRepo;
        }

        public List<TrainingDto> GetMyTraining()
        {
            var trainings = GetBy(x => x.EmployeeUpn.ToLower() == Session.Principal.Upn.ToLower());

            return trainings.ToList();
        }

        protected override TrainingDto PostMap(TrainingDto dto)
        {
            // Hmm handle inactive employees?
            return base.PostMap(dto);
        }

        protected override void OnBeforeCreate(CrudEventArgs<TrainingDto, Training> e)
        {
            if (string.IsNullOrEmpty(e.Entity.EmployeeName))
            {
                e.Dto.EmployeeUpn = Session.Principal.Upn;
                e.Dto.EmployeeName = Session.Principal.DisplayName;
            }

            UpdateEmployeeStatus(e);

            e.Entity.EmployeeStatus = e.Dto.EmployeeStatus;
            e.Entity.Year = e.Entity.TrainingDate.Year;

            // Ensure filing
            // Only 1 annual per year
            // Only 1 Initial ever
            var trainings = GetBy(x => x.EmployeeUpn.ToLower() == e.Dto.EmployeeUpn.ToLower());
            var checkList = trainings.Where(x => x.TrainingType == e.Dto.TrainingType && (e.Dto.TrainingType == "Initial" || x.Year == e.Dto.Year)).ToList();

            if (checkList.Count > 0)
            {
                e.Cancel = true;
                if (e.Dto.TrainingType == "Annual")
                    e.Msg = "Cannot create two annual trainings for the same year.";
                else
                    e.Msg = "Cannot create more than one initial training.";

                throw new InvalidTrainingEntryException(e.Msg);
            }
        }

        private void UpdateEmployeeStatus(CrudEventArgs<TrainingDto, Training> e)
        {
            var employee = EmployeeRepository.GetByUpn(e.Dto.EmployeeUpn);
            if (employee != null)
                e.Dto.EmployeeStatus = employee.Inactive ? EmployeeStatuses.INACTIVE : EmployeeStatuses.ACTIVE;
            else
                e.Dto.EmployeeStatus = EmployeeStatuses.INACTIVE;
        }

        protected override void OnCreated(CrudEventArgs<TrainingDto, Training> e)
        {
        }

        protected override void OnBeforeUpdate(CrudEventArgs<TrainingDto, Training> e)
        {
            // Only admin or submitted by can update a record
            if (!(Session.Principal.IsInRole(Roles.EthicsAppAdmin) || e.Entity.EmployeeUpn.ToLower() == Session.Principal.Upn.ToLower()))
            {
                e.Cancel = true;
                e.Msg = "Permission denied.";
            }

            if (!e.Cancel)
            {
                e.Entity.Year = e.Entity.TrainingDate.Year;
                UpdateEmployeeStatus(e);
            }
        }


        public void SyncEmployeeStatus(List<Employee> employees)
        {
            var trainings = GetAll().ToList();

            foreach(TrainingDto t in trainings )
            {
                var emp = employees.Where(x => x.Upn.ToLower() == t.EmployeeUpn.ToLower()).FirstOrDefault();
                var status = "";

                if (emp != null)
                    status = emp.Inactive ? EmployeeStatuses.INACTIVE : EmployeeStatuses.ACTIVE;
                else
                    status = EmployeeStatuses.INACTIVE;

                bool update = false;

                if (status != t.EmployeeStatus)
                {
                    t.EmployeeStatus = status;
                    update = true;
                }

                if (emp != null && emp.DisplayName != t.EmployeeName)
                {
                    t.EmployeeName = emp.DisplayName;
                    update = true;
                }

                if (!update) {
                    Update(t);
                }
            }
        }

        public override TrainingDto Update(TrainingDto dto)
        {
            if (!Permissions.CanUpdate)
                throw new SecurityException("Access denied.  Cannot update object of type " + typeof(Training).Name);

            var e = new CrudEventArgs<TrainingDto, Training>();
            var entity = Repository.Get(dto.Id, this.Permissions.PermissionFilter);

            e.Entity = entity;
            e.Dto = dto;

            OnBeforeUpdate(e);

            if (!e.Cancel)
            {
                e.Entity.TrainingDate = e.Dto.TrainingDate;
                e.Entity.EthicsOfficial = e.Dto.EthicsOfficial;
                e.Entity.Location = e.Dto.Location;
                e.Entity.TrainingType = e.Dto.TrainingType;
                e.Entity.EmployeeStatus = e.Dto.EmployeeStatus;

                Repository.Update(e.Entity);

                e.Dto = PostMap(MapToDto(e.Entity));

                OnUpdated(e);
            }

            return e.Dto;
        }

        public TrainingChart GetChart(int year)
        {
            var chart = new TrainingChart();
            var trainings = GetAll().ToList();
            var employees = GetTrainingEmployeesByYear(year);
            var employeeCount = employees.Count();

            //SetInactiveFlag(trainings, employees);

            chart.CompletedTraining = trainings.Where(x => x.TrainingType == TrainingType.Annual && x.Year == year && employees.Find(emp => emp.Upn.ToLower() == x.EmployeeUpn.ToLower()) != null).Select(x => new { x.EmployeeName, x.TrainingType, x.Year }).Distinct().Count();
            chart.TotalEmployees = employeeCount;

            //SyncEmployeeStatus(employees);

            return chart;
        }

        private List<Employee> GetTrainingEmployeesByYear(int year)
        {
            return EmployeeRepository.GetAllNoFilter(x =>
                x.Type != "CONT" &&
                ((x.HireDate.HasValue && x.HireDate.Value.Year <= year) || x.CreatedTime.Year <= year) &&
                (!x.Inactive || (x.InactiveDate.HasValue && x.InactiveDate.Value.Year > year)));
        }

        private List<Employee> GetNewEmployeesByYear(int year)
        {
            return EmployeeRepository.GetAllNoFilter(x =>
                x.Type != "CONT" &&
                ((x.HireDate.HasValue ? x.HireDate.Value.Year : x.CreatedTime.Year) == year) &&
                (!x.Inactive || (x.InactiveDate.HasValue && x.InactiveDate.Value.Year > year)));
        }

        public MemoryStream GetMissingTrainingReport(int year)
        {
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);

            // Only get Employees who were actually hired that year.
            // Gets a little tricky with inactive employees  that never took training in a year... For now just report them as missing
            var employees = GetTrainingEmployeesByYear(year);
            
            var annualTrainings = Repository.GetAll(x => x.Year == year && x.TrainingType == TrainingType.Annual);
            var allTrainings = Repository.GetAll(x => x.Year <= year);

            // Find all employees without an annual training in 'year'
            employees = employees.Where(x => annualTrainings.Find(train => train.EmployeeUpn.ToLower() == x.Upn.ToLower()) == null).ToList();

            writer.Write("Employee, Status, Hire Date, Inactive Date, Email, Last Training Date, Last Training Type" + Environment.NewLine);

            foreach (Employee emp in employees)
            {
                var lastTrainingDate = "";
                var lastTraining = allTrainings.Where(x => x.EmployeeUpn.ToLower() == emp.Upn.ToLower()).OrderByDescending(x => x.TrainingDate).FirstOrDefault();

                if (lastTraining != null)
                    lastTrainingDate = lastTraining.TrainingDate.ToString();
                else
                    lastTrainingDate = "N/A";

                writer.Write(string.Format("\"{0}\", {1}, {2}, {3}, {4}, {5}, {6}" + Environment.NewLine, emp.DisplayName, emp.Inactive ? "Inactive" : "Active", emp.HireDate.HasValue ? emp.HireDate.Value : "", emp.InactiveDate.HasValue ? emp.InactiveDate.Value : "", emp.EmailAddress, lastTrainingDate, lastTraining == null ? "" : lastTraining.TrainingType));
            }

            writer.Flush();
            stream.Position = 0;

            return stream;
        }

        public MemoryStream GetMissingInitialTrainingReport(int year, int days)
        {
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);

            // Only get Employees who were actually hired that year.
            // Gets a little tricky with inactive employees  that never took training in a year... For now just report them as missing
            var employees = GetNewEmployeesByYear(year);

            var allTrainings = Repository.GetAll(x => x.TrainingType == TrainingType.Initial);
            var initialTrainings = allTrainings.Where(x => x.TrainingType == TrainingType.Initial).ToList();
            

            // Find all employees without an initial training in 'year' within 'days' days.
            employees = employees.Where(x => initialTrainings.Find(train => train.EmployeeUpn.ToLower() == x.Upn.ToLower() && train.TrainingDate <= (x.HireDate.HasValue ? x.HireDate.Value.AddDays(days) : x.CreatedTime.AddDays(days))) == null).ToList();

            writer.Write("Employee, Status, Hire Date, Inactive Date, Email, Last Training Date, Last Training Type" + Environment.NewLine);

            foreach (Employee emp in employees)
            {
                var lastTrainingDate = "";
                var lastTraining = allTrainings.Where(x => x.EmployeeUpn.ToLower() == emp.Upn.ToLower()).OrderByDescending(x => x.TrainingDate).FirstOrDefault();

                if (lastTraining != null)
                    lastTrainingDate = lastTraining.TrainingDate.ToString();
                else
                    lastTrainingDate = "N/A";

                writer.Write(string.Format("\"{0}\", {1}, {2}, {3}, {4}, {5}, {6}" + Environment.NewLine, emp.DisplayName, emp.Inactive ? "Inactive" : "Active", emp.HireDate.HasValue ? emp.HireDate : emp.CreatedTime.Date, emp.InactiveDate.HasValue ? emp.InactiveDate.Value : "", emp.EmailAddress, lastTrainingDate, lastTraining == null ? "" : lastTraining.TrainingType));
            }

            writer.Flush();
            stream.Position = 0;

            return stream;
        }

        //public void SetInactiveFlag(List<TrainingDto> list, List<Employee> employees = null)
        //{
        //    if (employees == null)
        //        employees = EmployeeRepository.GetAll();

        //    foreach (TrainingDto t in list)
        //    {
        //        var emp = employees.Where(x => x.Upn.ToLower() == t.EmployeeUpn.ToLower()).FirstOrDefault();

        //        if (emp != null)
        //            t.EmployeeStatus = emp.Inactive ? EmployeeStatuses.INACTIVE : EmployeeStatuses.ACTIVE;
        //        else
        //            t.EmployeeStatus = EmployeeStatuses.INACTIVE;
        //    }
        //}
    }

    public class InvalidTrainingEntryException : Exception 
    { 
        public InvalidTrainingEntryException() { }

        public InvalidTrainingEntryException(string message) : base(String.Format("Invalid Training Entry: {0}.", message)) { }
    }
}
