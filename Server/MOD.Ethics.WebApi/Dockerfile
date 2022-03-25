#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["MOD.Ethics.WebApi/Mod.Ethics.WebApi.csproj", "MOD.Ethics.WebApi/"]
COPY ["Mod.Ethics.Infrastructure/Mod.Ethics.Infrastructure.csproj", "Mod.Ethics.Infrastructure/"]
COPY ["../Framework/Server/Mod.Framework.Notifications/Mod.Framework.Notifications.csproj", "../Framework/Server/Mod.Framework.Notifications/"]
COPY ["../Framework/Server/Mod.Framework.User/Mod.Framework.User.csproj", "../Framework/Server/Mod.Framework.User/"]
COPY ["../Framework/Server/Mod.Framework.EfCore/Mod.Framework.EfCore.csproj", "../Framework/Server/Mod.Framework.EfCore/"]
COPY ["../Framework/Server/Mod.Framework/Mod.Framework.csproj", "../Framework/Server/Mod.Framework/"]
COPY ["../Framework/Server/Mod.Framework.Serilog/Mod.Framework.Serilog.csproj", "../Framework/Server/Mod.Framework.Serilog/"]
COPY ["Mod.Ethics.Application/Mod.Ethics.Application.csproj", "Mod.Ethics.Application/"]
COPY ["Mod.Ethics.Domain/Mod.Ethics.Domain.csproj", "Mod.Ethics.Domain/"]
COPY ["../Framework/Server/Mod.Framework.Attachments/Mod.Framework.Attachments.csproj", "../Framework/Server/Mod.Framework.Attachments/"]
COPY ["../Framework/Server/Mod.Framework.WebApi/Mod.Framework.WebApi.csproj", "../Framework/Server/Mod.Framework.WebApi/"]
RUN dotnet restore "MOD.Ethics.WebApi/Mod.Ethics.WebApi.csproj"
COPY . .
WORKDIR "/src/MOD.Ethics.WebApi"
RUN dotnet build "Mod.Ethics.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Mod.Ethics.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Mod.Ethics.WebApi.dll"]