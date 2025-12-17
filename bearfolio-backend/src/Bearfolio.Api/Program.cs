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
var conn = builder.Configuration.GetConnectionString("Postgres") ?? string.Empty;

builder.Host.UseSerilog((ctx, cfg) => cfg
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console());

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var connectionString = builder.Configuration.GetConnectionString("Postgres");
    opt.UseNpgsql(connectionString, npg => npg.UseVector());
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

builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment());

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
app.Logger.LogInformation("Postgres connection: {Conn}", conn);

// Apply database migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Applying database migrations...");
        await db.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating the database");
        throw;
    }
}

app.UseSerilogRequestLogging();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL("/graphql");
app.MapHealthEndpoints();
app.MapGet("/", () => Results.Redirect("/graphql"));
app.MapGet("/health", () => Results.Ok("Healthy"));

// Log sanitized Postgres connection string (mask credentials)

app.Run();
