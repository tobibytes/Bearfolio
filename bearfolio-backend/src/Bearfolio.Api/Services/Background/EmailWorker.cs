namespace Bearfolio.Api.Services.Background;

public class EmailWorker : BackgroundService
{
    private readonly EmailService _emails;
    private readonly ILogger<EmailWorker> _logger;
    public EmailWorker(EmailService emails, ILogger<EmailWorker> logger)
    {
        _emails = emails;
        _logger = logger;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await _emails.ProcessQueueAsync(stoppingToken);
        }
        catch (OperationCanceledException) { }
        catch (Exception ex)
        {
            _logger.LogError(ex, "EmailWorker failed");
        }
    }
}
