FROM mcr.microsoft.com/dotnet/sdk:8.0 AS base

USER "root"
RUN useradd --user-group --uid 2001 --password '*' dotnetcore-app

RUN mkdir "/app"
COPY . /app

USER 2001
WORKDIR /app
ENTRYPOINT ["dotnet", "Mod.Ethics.Migration.dll"]