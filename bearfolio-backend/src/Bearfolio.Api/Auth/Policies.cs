using Microsoft.AspNetCore.Authorization;

namespace Bearfolio.Api.Auth;

public static class Policies
{
    public static void AddAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy(GraphQL.AuthPolicies.Admin, policy => policy.RequireRole("Admin"));
        });
    }
}
