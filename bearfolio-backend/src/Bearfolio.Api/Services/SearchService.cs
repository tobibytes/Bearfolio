using Bearfolio.Api.Data;
using Microsoft.EntityFrameworkCore;
using Pgvector;

namespace Bearfolio.Api.Services;

public class SearchService
{
    private readonly AppDbContext _db;
    private readonly EmbeddingService _embedding;

    public SearchService(AppDbContext db, EmbeddingService embedding)
    {
        _db = db;
        _embedding = embedding;
    }

    public Task<IEnumerable<PortfolioItem>> FullTextSearchAsync(string text, CancellationToken ct = default)
    {
        var query = _db.PortfolioItems
            .Where(p => p.State == ItemState.Published && !p.IsDeleted &&
                        EF.Functions.ToTsVector("english", p.Title + " " + p.Summary)
                            .Matches(EF.Functions.PlainToTsQuery("english", text)));
        return Task.FromResult(query.AsEnumerable());
    }

    public async Task<IEnumerable<PortfolioItem>> SemanticSearchAsync(string text, CancellationToken ct = default)
    {
        var vector = await _embedding.GenerateEmbeddingAsync(text, ct);
        return await _db.PortfolioItems
            .FromSqlInterpolated($@"SELECT * FROM ""PortfolioItems""
                WHERE ""IsDeleted"" = FALSE AND ""State"" = {(int)ItemState.Published}
                ORDER BY ""Embedding"" <-> {vector}
                LIMIT 20")
            .ToListAsync(ct);
    }
}
