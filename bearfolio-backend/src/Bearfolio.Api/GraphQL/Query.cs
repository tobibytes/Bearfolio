using Bearfolio.Api.Data;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Bearfolio.Api.GraphQL;

public class Query
{
    [UsePaging, UseProjection, UseFiltering, UseSorting]
    public IQueryable<Profile> GetStudents([Service] AppDbContext db) =>
        db.Profiles.Where(p => p.State == ProfileState.Public);

    public Task<Profile?> GetStudent(Guid id, [Service] AppDbContext db) =>
        db.Profiles.Include(p => p.PortfolioItems).FirstOrDefaultAsync(p => p.Id == id);

    [Authorize]
    public async Task<Profile?> GetMe([Service] AppDbContext db, [Service] Services.AuthService auth)
    {
        var user = await auth.GetCurrentUserAsync();
        return await db.Profiles.Include(p => p.PortfolioItems).FirstOrDefaultAsync(p => p.UserId == user.Id && !p.IsDeleted);
    }

    [UsePaging, UseProjection, UseFiltering, UseSorting]
    public IQueryable<PortfolioItem> GetPortfolioItems([Service] AppDbContext db) =>
        db.PortfolioItems.Where(p => p.State == ItemState.Published);

    public Task<PortfolioItem?> GetPortfolioItem(Guid id, [Service] AppDbContext db) =>
        db.PortfolioItems.FirstOrDefaultAsync(p => p.Id == id);

    [UsePaging, UseProjection, UseFiltering, UseSorting]
    public IQueryable<Opportunity> GetOpportunities([Service] AppDbContext db) => db.Opportunities;

    public Task<IEnumerable<PortfolioItem>> Search(string text, [Service] Services.SearchService search) =>
        search.FullTextSearchAsync(text);

    public Task<IEnumerable<PortfolioItem>> SemanticSearch(string text, [Service] Services.SearchService search) =>
        search.SemanticSearchAsync(text);
}
