using Bearfolio.Api.Auth;
using Bearfolio.Api.Data;
using Bearfolio.Api.Extensions;
using Bearfolio.Api.GraphQL;
using Bearfolio.Api.Health;
using Bearfolio.Api.Services;
using Bearfolio.Api.Services.Background;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, cfg) => cfg
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console());

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"), npg => npg.UseVector());
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "App";
    options.DefaultChallengeScheme = "App";
})
.AddJwtBearer("App", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Auth:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Auth:Audience"],
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Auth:JwtKey"] ?? string.Empty)),
        NameClaimType = ClaimTypes.Email
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = ctx =>
        {
            if (ctx.Request.Cookies.TryGetValue("bf_auth", out var token) && string.IsNullOrWhiteSpace(ctx.Token))
            {
                ctx.Token = token;
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = ctx =>
        {
            var email = ctx.Principal?.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrWhiteSpace(email) || !email.EndsWith("@morgan.edu", StringComparison.OrdinalIgnoreCase))
            {
                ctx.Fail("not authorized");
            }
            return Task.CompletedTask;
        }
    };
})
.AddJwtBearer("Google", options =>
{
    options.Authority = "https://accounts.google.com";
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuers = new[] { "accounts.google.com", "https://accounts.google.com" },
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Google:ClientId"],
        ValidateLifetime = true,
        NameClaimType = ClaimTypes.Email
    };
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = ctx =>
        {
            var email = ctx.Principal?.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrWhiteSpace(email) || !email.EndsWith("@morgan.edu", StringComparison.OrdinalIgnoreCase))
            {
                ctx.Fail("not authorized");
            }
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization();
builder.Services.AddAuthorizationPolicies();

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        var origins = builder.Configuration["Cors:Origins"]?.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        if (origins is { Length: > 0 })
        {
            policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
        }
        else
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
    });
});

builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions();

builder.Services.AddHealthChecks().AddNpgSql(builder.Configuration.GetConnectionString("Postgres")!);

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UploadService>();
builder.Services.AddHttpClient<EmbeddingService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<SearchService>();
builder.Services.AddHttpClient();

builder.Services.AddHostedService<EmbeddingWorker>();
builder.Services.AddHostedService<CleanupWorker>();
builder.Services.AddHostedService<EmailWorker>();

builder.Services.AddOpenTelemetryTracingAndMetrics(builder.Configuration);

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseRouting();
app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL("/graphql");
app.MapHealthEndpoints();

app.Run();
