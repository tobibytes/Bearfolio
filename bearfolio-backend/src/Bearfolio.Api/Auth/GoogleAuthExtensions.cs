using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;

namespace Bearfolio.Api.Auth;

public static class GoogleAuthExtensions
{
    public static AuthenticationBuilder AddGoogleAuth(this IServiceCollection services, IConfiguration config)
    {
        return services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = GoogleDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
        }).AddGoogle(options =>
        {
            options.ClientId = config["Google:ClientId"] ?? string.Empty;
            options.ClientSecret = config["Google:ClientSecret"] ?? string.Empty;
            options.Events.OnCreatingTicket = ctx =>
            {
                var email = ctx.Principal?.Identity?.Name ?? string.Empty;
                if (!email.EndsWith("@morgan.edu", StringComparison.OrdinalIgnoreCase))
                {
                    throw new Exception("not authorized");
                }
                return Task.CompletedTask;
            };
        });
    }
}
