namespace Bearfolio.Api.Services.Background;

public class EmailWorker : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<EmailWorker> _logger;
    
    public EmailWorker(IServiceProvider services, ILogger<EmailWorker> logger)
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
                var emails = scope.ServiceProvider.GetRequiredService<EmailService>();
                await emails.ProcessQueueAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Expected when application is shutting down
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmailWorker failed");
            }
            
            // Wait before processing next batch
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
