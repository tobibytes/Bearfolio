using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Bearfolio.Api.Data;
using Bearfolio.Api.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Bearfolio.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly AuthService _authService;

    public AuthController(IConfiguration config, AuthService authService)
    {
        _config = config;
        _authService = authService;
    }

    [HttpPost("exchange")]
    [HttpPost("/exchange")] // backwards-compat for clients calling root-level /exchange
    public async Task<IActionResult> Exchange([FromBody] TokenRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.IdToken))
            return BadRequest("idToken required");

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
        }
        catch
        {
            return Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(payload.Email) || !payload.Email.EndsWith("@morgan.edu", StringComparison.OrdinalIgnoreCase))
            return Unauthorized();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, payload.Email),
            new Claim(ClaimTypes.NameIdentifier, payload.Subject ?? payload.Email),
            new Claim(ClaimTypes.Name, payload.Name ?? payload.Email)
        };

        var adminEmails = _config["Admin:Emails"]?.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries) ?? Array.Empty<string>();
        if (adminEmails.Contains(payload.Email, StringComparer.OrdinalIgnoreCase))
        {
            claims.Add(new Claim(ClaimTypes.Role, "Admin"));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Auth:JwtKey"] ?? string.Empty));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _config["Auth:Issuer"],
            audience: _config["Auth:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        Response.Cookies.Append("bf_auth", jwt, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddHours(8)
        });

        // touch user record
        await _authService.GetOrCreateUserAsync(payload.Subject ?? payload.Email, payload.Email, payload.Name);

        return Ok(new { token = jwt });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("bf_auth");
        return Ok();
    }
}

public record TokenRequest(string IdToken);
