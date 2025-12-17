# Bearfolio Backend (GraphQL, .NET 9, HotChocolate)

## Stack
- .NET 9, ASP.NET Core
- HotChocolate GraphQL (queries, mutations, subscriptions)
- PostgreSQL with pgvector + (planned) FTS
- Serilog + OpenTelemetry
- Health checks (/health/liveness, /health/readiness)
- Google OAuth (morgan.edu enforced)
- Cloudflare R2 signed uploads, embeddings API, SendGrid (guarded by env vars)

## Structure
- `Bearfolio.sln`
- `src/Bearfolio.Api`
  - GraphQL types (Query, Mutation, Subscription, Inputs)
  - EF Core models/context
  - Services (Auth, Upload, Embedding, Email, Search)
  - Background workers (Embedding, Cleanup, Email)
  - Extensions (Telemetry, Serilog, Health)
  - appsettings.json + environment overrides

## Env Vars (no secrets committed)
- `ASPNETCORE_ENVIRONMENT` (Development|Staging|Production)
- `ConnectionStrings__Postgres`
- `Google__ClientId`, `Google__ClientSecret`
- `R2__AccessKey`, `R2__SecretKey`, `R2__Bucket`, `R2__AccountId`
- `Embeddings__ApiKey`, `Embeddings__Endpoint`
- `SendGrid__ApiKey`
- `OTel__Endpoint` (default http://localhost:4317)
- `Cors__Origins` (semicolon-separated list of allowed frontend origins, e.g. `https://bearfolio.app;http://localhost:5173`)
- `Serilog__MinimumLevel__Default` (Debug/Information)

## Run
```
docker build -t bearfolio-api .
docker run -p 8080:8080 \
  -e ConnectionStrings__Postgres="Host=...;Database=...;Username=...;Password=..." \
  -e Cors__Origins="https://your-frontend.example" \
  -e Google__ClientId=... -e Google__ClientSecret=... \
  bearfolio-api

cd bearfolio-backend
# dotnet ef database update --project src/Bearfolio.Api (when migrations are fleshed out)
dotnet run --project src/Bearfolio.Api
```
GraphQL endpoint: `/graphql`
Health: `/health/liveness`, `/health/readiness`

## Notes / TODO
- Flesh out migrations with full schema, FTS columns, and ivfflat indexes.
- Implement real pgvector semantic search and tsvector FTS queries.
- Implement SendGrid notification flows and email queueing.
- Harden Google OAuth callback settings for App Service slots.
- Add admin impersonation logic and audit logging.
- Add readiness/liveness probes for Azure App Service deployment slots.
