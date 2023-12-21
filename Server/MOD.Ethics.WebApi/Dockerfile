#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

COPY . ./app

WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS='http://+:5000/'
ENV APP_BASE_PATH='/api'

ENTRYPOINT ["dotnet", "Mod.Ethics.WebApi.dll"]