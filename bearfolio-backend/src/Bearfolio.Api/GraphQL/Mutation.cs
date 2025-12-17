using Bearfolio.Api.Data;
using Bearfolio.Api.Services;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Bearfolio.Api.GraphQL;

public class Mutation
{
    [Authorize]
    public async Task<Profile> CreateProfile(ProfileInput input, [Service] AppDbContext db, [Service] AuthService auth, CancellationToken ct)
    {
        var user = await auth.GetCurrentUserAsync();
        var existing = await db.Profiles.FirstOrDefaultAsync(p => p.UserId == user.Id && !p.IsDeleted, ct);
        if (existing is not null) throw new GraphQLException("profile exists");

        var profile = new Profile
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = input.Name,
            Headline = input.Headline,
            Bio = input.Bio,
            Location = input.Location,
            Year = input.Year,
            Fields = input.Fields,
            Interests = input.Interests,
            Strengths = input.Strengths,
            LinksJson = input.LinksJson,
            SkillsJson = input.SkillsJson,
            AvatarUrl = input.AvatarUrl,
            State = ProfileState.Draft,
            Onboarded = input.Onboarded,
            CreatedBy = user.Email,
            UpdatedBy = user.Email
        };
        db.Profiles.Add(profile);
        await db.SaveChangesAsync(ct);
        return profile;
    }

    [Authorize]
    public async Task<Profile> UpdateProfile(Guid id, ProfileInput input, [Service] AppDbContext db, [Service] AuthService auth, CancellationToken ct)
    {
        var user = await auth.GetCurrentUserAsync();
        var profile = await db.Profiles.FirstAsync(p => p.Id == id && p.UserId == user.Id && !p.IsDeleted, ct);
        profile.Name = input.Name;
        profile.Headline = input.Headline;
        profile.Bio = input.Bio;
        profile.Location = input.Location;
        profile.Year = input.Year;
        profile.Fields = input.Fields;
        profile.Interests = input.Interests;
        profile.Strengths = input.Strengths;
        profile.LinksJson = input.LinksJson;
        profile.SkillsJson = input.SkillsJson;
        profile.AvatarUrl = input.AvatarUrl;
        profile.Onboarded = input.Onboarded;
        profile.UpdatedAt = DateTime.UtcNow;
        profile.UpdatedBy = user.Email;
        await db.SaveChangesAsync(ct);
        return profile;
    }

    [Authorize]
    public async Task<PortfolioItem> SubmitPortfolioItem(PortfolioItemInput input, [Service] AppDbContext db, [Service] AuthService auth, [Service] EmbeddingService embed, [Service] ITopicEventSender sender, [Service] EmailService emails, CancellationToken ct)
    {
        var user = await auth.GetCurrentUserAsync();
        var profile = await db.Profiles.FirstAsync(p => p.Id == input.ProfileId && p.UserId == user.Id && !p.IsDeleted, ct);
        var item = new PortfolioItem
        {
            Id = Guid.NewGuid(),
            ProfileId = profile.Id,
            Type = input.Type,
            Format = input.Format,
            Title = input.Title,
            Summary = input.Summary,
            Tags = input.Tags,
            ContentJson = input.ContentJson,
            DetailTemplate = input.DetailTemplate,
            HeroImageUrl = input.HeroImageUrl,
            LinksJson = input.LinksJson,
            State = ItemState.Draft,
            CreatedBy = user.Email,
            UpdatedBy = user.Email
        };
        item.Embedding = await embed.GenerateEmbeddingAsync(item.Summary, ct);
        db.PortfolioItems.Add(item);
        await db.SaveChangesAsync(ct);
        await sender.SendAsync("portfolioItemPublished", item, ct);
        await emails.EnqueueAsync(user.Email, "Portfolio item submitted", $"Your item '{item.Title}' was submitted.", ct);
        return item;
    }

    [Authorize]
    public async Task<PortfolioItem> PublishPortfolioItem(Guid id, [Service] AppDbContext db, [Service] AuthService auth, [Service] ITopicEventSender sender, [Service] EmailService emails, CancellationToken ct)
    {
        var user = await auth.GetCurrentUserAsync();
        var item = await db.PortfolioItems.Include(p => p.Profile).ThenInclude(x => x.User).FirstAsync(p => p.Id == id && !p.IsDeleted, ct);
        if (item.Profile.UserId != user.Id) throw new GraphQLException("not authorized");
        item.State = ItemState.Published;
        item.UpdatedAt = DateTime.UtcNow;
        item.UpdatedBy = user.Email;
        await db.SaveChangesAsync(ct);
        await sender.SendAsync("portfolioItemPublished", item, ct);
        await emails.EnqueueAsync(item.Profile.User.Email, "Portfolio item published", $"Your item '{item.Title}' is now published.", ct);
        return item;
    }

    [Authorize]
    public async Task<PortfolioItem> UpdatePortfolioItem(Guid id, PortfolioItemInput input, [Service] AppDbContext db, [Service] AuthService auth, [Service] EmbeddingService embed, CancellationToken ct)
    {
        var user = await auth.GetCurrentUserAsync();
        var item = await db.PortfolioItems.Include(p => p.Profile).FirstAsync(p => p.Id == id && !p.IsDeleted, ct);
        if (item.Profile.UserId != user.Id) throw new GraphQLException("not authorized");
        item.Type = input.Type;
        item.Format = input.Format;
        item.Title = input.Title;
        item.Summary = input.Summary;
        item.Tags = input.Tags;
        item.ContentJson = input.ContentJson;
        item.DetailTemplate = input.DetailTemplate;
        item.HeroImageUrl = input.HeroImageUrl;
        item.LinksJson = input.LinksJson;
        item.Embedding = await embed.GenerateEmbeddingAsync(item.Summary, ct);
        item.UpdatedAt = DateTime.UtcNow;
        item.UpdatedBy = user.Email;
        await db.SaveChangesAsync(ct);
        return item;
    }

    [Authorize]
    public async Task<bool> DeletePortfolioItem(Guid id, [Service] AppDbContext db, [Service] AuthService auth, CancellationToken ct)
    {
        var user = await auth.GetCurrentUserAsync();
        var item = await db.PortfolioItems.Include(p => p.Profile).FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);
        if (item is null) return false;
        if (item.Profile.UserId != user.Id) throw new GraphQLException("not authorized");
        item.IsDeleted = true;
        item.UpdatedAt = DateTime.UtcNow;
        item.UpdatedBy = user.Email;
        await db.SaveChangesAsync(ct);
        return true;
    }

    [Authorize]
    public Task<UploadUrlPayload> RequestUploadUrl(UploadRequest input, [Service] UploadService upload) =>
        upload.CreateSignedUrlAsync(input);

    [Authorize(Policy = AuthPolicies.Admin)]
    public async Task<Opportunity> CreateOpportunity(OpportunityInput input, [Service] AppDbContext db, CancellationToken ct)
    {
        var opp = new Opportunity
        {
            Id = Guid.NewGuid(),
            Title = input.Title,
            Org = input.Org,
            Category = input.Category,
            Fields = input.Fields,
            Tags = input.Tags,
            DesiredFormats = input.DesiredFormats,
            Status = "Draft",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.Opportunities.Add(opp);
        await db.SaveChangesAsync(ct);
        return opp;
    }

    [Authorize(Policy = AuthPolicies.Admin)]
    public async Task<User> ImpersonateUser(Guid userId, [Service] AuthService auth, [Service] AppDbContext db, [Service] IHttpContextAccessor http, CancellationToken ct)
    {
        var admin = await auth.GetCurrentUserAsync();
        if (!await auth.IsAdminAsync(admin.Id)) throw new GraphQLException("not authorized");
        var target = await db.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted, ct) ?? throw new GraphQLException("not authorized");
        http.HttpContext?.Items.TryAdd("ImpersonatedUserId", target.Id);
        return target;
    }
}
