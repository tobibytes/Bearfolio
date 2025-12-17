using Bearfolio.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Bearfolio.Api.Services.Background;

public class EmbeddingWorker : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<EmbeddingWorker> _logger;

    public EmbeddingWorker(IServiceProvider services, ILogger<EmbeddingWorker> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var embed = scope.ServiceProvider.GetRequiredService<EmbeddingService>();
                var pending = await db.PortfolioItems.Where(p => p.State == ItemState.Published).ToListAsync(stoppingToken);
                foreach (var item in pending)
                {
                    item.Embedding = await embed.GenerateEmbeddingAsync(item.Summary, stoppingToken);
                }
                if (pending.Any()) await db.SaveChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmbeddingWorker failed");
            }
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
