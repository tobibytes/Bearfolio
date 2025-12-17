using Bearfolio.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Bearfolio.Api.Services;

public class AuthService
{
    private readonly IHttpContextAccessor _http;
    private readonly AppDbContext _db;

    public AuthService(IHttpContextAccessor http, AppDbContext db)
    {
        _http = http;
        _db = db;
    }

    public async Task<User> GetOrCreateUserAsync(string googleId, string email, string? name, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId && !u.IsDeleted, ct);
        if (user is null)
        {
            user = new User { GoogleId = googleId, Email = email, Name = name ?? email.Split('@')[0] };
            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);
        }
        return user;
    }

    public async Task<User> GetCurrentUserAsync()
    {
        var email = _http.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrWhiteSpace(email) || !email.EndsWith("@morgan.edu", StringComparison.OrdinalIgnoreCase))
            throw new GraphQLException("not authorized");

        var googleId = _http.HttpContext!.User.FindFirst("sub")?.Value ?? string.Empty;
        if (string.IsNullOrWhiteSpace(googleId)) throw new GraphQLException("not authorized");

        return await GetOrCreateUserAsync(googleId, email, _http.HttpContext?.User?.Identity?.Name ?? email);
    }

    public async Task<bool> IsAdminAsync(Guid userId)
    {
        return await _db.Admins.AnyAsync(a => a.UserId == userId && !a.IsDeleted);
    }
}
