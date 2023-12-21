using Microsoft.Extensions.Logging;
using Mod.Ethics.Application.Dtos;
using Mod.Framework.Application.ObjectMapping;
using Mod.Framework.Domain.Entities;
using Mod.Framework.Domain.Repositories;
using Mod.Framework.Runtime.Security;
using Mod.Framework.Runtime.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Security;

namespace Mod.Framework.Application
{
    public abstract class TableAppServiceBase<TTable, TDto, TEntity, TTableEntity> : TableAppServiceBase<TTable, TDto, TEntity, TTableEntity, int>
        where TTable : TableBase<TDto>
        where TDto : IDto<int>, new()
        where TEntity : IEntity<int>, new()
    {
        public TableAppServiceBase(IRepository<TEntity, int> repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(repository, objectMapper, logger, session)
        {
        }
    }

    public abstract class TableAppServiceBase<TTable, TDto, TEntity, TTableEntity, TPrimaryKey> : AppService
        where TTable : TableBase<TDto>
        where TEntity : IEntity<TPrimaryKey>
        where TDto : IDto<TPrimaryKey>
    {
        protected readonly IRepository<TEntity, TPrimaryKey> Repository;
        public IPermissions<TTableEntity> Permissions { get; set; }

        public TableAppServiceBase(IRepository<TEntity, TPrimaryKey> repository, IObjectMapper objectMapper, ILogger<IAppService> logger, IModSession session) : base(objectMapper, logger, session)
        {
            Repository = repository;
            SetPermissions();
        }

        public virtual TableBase<TDto> Get(int page, int pageSize, string sort, string sortDirection, string filter)
        {
            if (!Permissions.CanRead)
                throw new SecurityException("Access denied.  Cannot read object of type " + typeof(TEntity).Name);

            sortDirection = sortDirection ?? "desc";

            var tb = new TableBase<TDto>();
            var query = Query();
            query = query.Where(this.Permissions.PermissionFilter);

            query = Filter(query, filter);
            tb.Total = query.Count();

            if (!string.IsNullOrEmpty(sort))
                query = OrderBy(query, sort, sortDirection.ToLower() == "desc");
            
            query = query.Skip((page - 1) * pageSize).Take(pageSize);
            
            tb.Page = page;
            tb.PageSize = pageSize;
            tb.Sort = sort;
            tb.SortDirection = sortDirection;
            tb.Data = query.Select(Map).ToList();
            tb.TotalPages = tb.Total / tb.PageSize + 1;

            return tb;
        }

        protected abstract IQueryable<TTableEntity> Query();

        public IQueryable<TTableEntity> OrderBy(IQueryable<TTableEntity> source, string orderByProperty, bool desc)
        {
            string command = desc ? "OrderByDescending" : "OrderBy";
            var type = typeof(TTableEntity);
            var property = type.GetProperty(orderByProperty, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            var parameter = Expression.Parameter(type, "p");
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExpression = Expression.Lambda(propertyAccess, parameter);
            var resultExpression = Expression.Call(typeof(Queryable), command, new Type[] { type, property.PropertyType },
                                          source.Expression, Expression.Quote(orderByExpression));

            return source.Provider.CreateQuery<TTableEntity>(resultExpression);
        }

        protected abstract IQueryable<TTableEntity> Filter(IQueryable<TTableEntity> source, string filter);

        protected TDto Map(TTableEntity entity)
        {
            return PostMap(MapToDto(entity));
        }

        protected virtual TDto PostMap(TDto dto)
        {
            return dto;
        }

        protected virtual void SetPermissions()
        {
            Permissions = TruePermissions<TTableEntity>.Instance;
        }

        /// <summary>
        /// Maps <typeparamref name="TEntity"/> to <typeparamref name="TDto"/>.
        /// It uses <see cref="IObjectMapper"/> by default.
        /// It can be overrided for custom mapping.
        /// </summary>
        protected virtual TDto MapToDto(TTableEntity entity)
        {
            return ObjectMapper.Map<TDto>(entity);
        }
    }
}
