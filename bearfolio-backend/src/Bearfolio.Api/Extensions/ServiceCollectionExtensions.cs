using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;

namespace Bearfolio.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddOpenTelemetryTracingAndMetrics(this IServiceCollection services, IConfiguration config)
    {
        var endpoint = config["OTel:Endpoint"] ?? "http://localhost:4317";
        services.AddOpenTelemetry()
            .ConfigureResource(r => r.AddService("Bearfolio.Api"))
            .WithTracing(b => b
                .AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .AddOtlpExporter(o => o.Endpoint = new Uri(endpoint)))
            .WithMetrics(b => b
                .AddAspNetCoreInstrumentation()
                .AddProcessInstrumentation()
                .AddRuntimeInstrumentation()
                .AddOtlpExporter(o => o.Endpoint = new Uri(endpoint)));
        return services;
    }
}
