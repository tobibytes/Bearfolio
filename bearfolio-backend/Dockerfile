# Build and publish the API
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy solution and project files first for better layer caching
COPY Bearfolio.sln ./
COPY src/Bearfolio.Api/Bearfolio.Api.csproj ./src/Bearfolio.Api/
RUN dotnet restore

# copy the rest of the source
COPY . .
RUN dotnet publish src/Bearfolio.Api/Bearfolio.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Ensure CA certificates are present for Postgres/SSL trust
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Bearfolio.Api.dll"]
