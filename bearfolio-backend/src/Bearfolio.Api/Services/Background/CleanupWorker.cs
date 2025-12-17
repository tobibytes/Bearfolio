namespace Bearfolio.Api.Services.Background;

public class CleanupWorker : BackgroundService
{
    private readonly ILogger<CleanupWorker> _logger;
    public CleanupWorker(ILogger<CleanupWorker> logger) { _logger = logger; }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // placeholder for cleanup logic (soft delete purge, etc.)
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CleanupWorker failed");
            }
            await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
        }
    }
}
