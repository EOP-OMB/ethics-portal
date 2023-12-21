using Castle.DynamicProxy.Generators.Emitters.SimpleAST;
using Microsoft.EntityFrameworkCore;
using Mod.Ethics.Domain.Entities;
using Mod.Ethics.Domain.Enumerations;
using Mod.Ethics.Domain.Interfaces;
using Mod.Ethics.Domain.Views;
using Mod.Framework.Application;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.EfCore.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Infrastructure.EfCore.Repositories
{
    public class OgeForm450Repository : EfRepositoryBase<EthicsContext, OgeForm450>, IOgeForm450Repository
    {
        public OgeForm450Repository(EthicsContext context) : base(context)
        {
        }

        //public override OgeForm450 Update(OgeForm450 entity)
        //{
        //    var existingParent = Context.OgeForm450s
        //        .Where(p => p.Id == entity.Id)
        //            .Include(p => p.ReportableInformation)
        //            .Include(p => p.OgeForm450Statuses)
        //        .SingleOrDefault();

        //    if (existingParent != null)
        //    {
        //        entity.CreatedTime = existingParent.CreatedTime;

        //        // Update parent
        //        Context.Entry(existingParent).CurrentValues.SetValues(entity);

        //        // Delete children
        //        foreach (var existingChild in existingParent.ReportableInformation.ToList())
        //        {
        //            if (!entity.ReportableInformation.Any(c => c.Id == existingChild.Id))
        //                Context.OgeForm450ReportableInformation.Remove(existingChild);
        //        }

        //        // Update and Insert children
        //        foreach (var childModel in entity.ReportableInformation)
        //        {
        //            var existingChild = existingParent.ReportableInformation
        //                .Where(c => c.Id == childModel.Id && c.Id > 0)
        //                .SingleOrDefault();

        //            if (existingChild != null)
        //                // Update child
        //                Context.Entry(existingChild).CurrentValues.SetValues(childModel);
        //            else
        //            {
        //                // Insert child
        //                var newChild = new OgeForm450ReportableInformation
        //                {
        //                    OgeForm450Id = childModel.OgeForm450Id,
        //                    Name = childModel.Name,
        //                    Type = childModel.Type,
        //                    Description = childModel.Description,
        //                    AdditionalInfo = childModel.AdditionalInfo,
        //                    NoLongerHeld = childModel.NoLongerHeld
        //                };
        //                existingParent.ReportableInformation.Add(newChild);
        //            }
        //        }

        //        Context.SaveChanges();
        //    }

        //    return entity;
        //}

        public OgeForm450 GetPreviousForm(int year, string upn)
        {
            var forms = QueryIncluding(x => x.ReportableInformation, y => y.OgeForm450Statuses)
                .Where(x => x.FilerUpn.ToLower() == upn.ToLower() && x.FormStatus != OgeForm450Statuses.CANCELED)
                .OrderByDescending(x => x.DueDate);

            OgeForm450 previousForm = null;

            if (forms.Count() > 1)
            {
                previousForm = forms.ToList()[1];
            }

            return previousForm;
        }

        public IQueryable<OgeForm450Table> QueryTable()
        {
            var q = QueryIncluding(x => x.OgeForm450Statuses).Select(obj => new OgeForm450Table
            {
                Id = obj.Id,
                EmployeesName = obj.EmployeesName,
                CreatedTime = obj.CreatedTime,
                ReportingStatus = obj.ReportingStatus,
                FormStatus = obj.FormStatus,
                DateSubmitted = obj.OgeForm450Statuses.FirstOrDefault(x => x.Status == OgeForm450Statuses.SUBMITTED) == null ? null : obj.OgeForm450Statuses.FirstOrDefault(x => x.Status == OgeForm450Statuses.SUBMITTED).CreatedTime,
                FormFlagDescription = "",
                DueDate = obj.DueDate.Date,
                AssignedToUpn = obj.AssignedToUpn,
                AssignedTo = obj.AssignedTo,
                FormFlags = obj.FormFlags,
                HasAgreementsOrArrangements = obj.HasAgreementsOrArrangements,
                HasAssetsOrIncome = obj.HasAssetsOrIncome,
                HasGiftsOrTravelReimbursements = obj.HasGiftsOrTravelReimbursements,
                HasLiabilities = obj.HasLiabilities,
                HasOutsidePositions = obj.HasOutsidePositions,
                DaysExtended = obj.DaysExtended,
                ReviewStatus = obj.ReviewStatus,
                SubstantiveReviewer = obj.SubstantiveReviewer,
                SubstantiveReviewerUpn = obj.SubstantiveReviewerUpn,
                DateOfSubstantiveReview = obj.DateOfSubstantiveReview
            });
            
            return q;
        }
    }
}
