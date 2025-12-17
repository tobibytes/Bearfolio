using System.Threading.Channels;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Bearfolio.Api.Services;

public class EmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;
    private static readonly Channel<EmailMessage> Channel = System.Threading.Channels.Channel.CreateUnbounded<EmailMessage>();

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task EnqueueAsync(string to, string subject, string body, CancellationToken ct = default)
    {
        await Channel.Writer.WriteAsync(new EmailMessage(to, subject, body), ct);
    }

    public async Task SendAsync(string to, string subject, string body, CancellationToken ct = default)
    {
        if (_config.GetValue<bool>("Features:UseMocks"))
        {
            _logger.LogInformation("Mock email to {To} subject {Subject}", to, subject);
            return;
        }

        var apiKey = _config["SendGrid:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("SendGrid not configured; skipping email");
            return;
        }

        var client = new SendGridClient(apiKey);
        var msg = MailHelper.CreateSingleEmail(new EmailAddress("noreply@bearfolio.edu", "Bearfolio"), new EmailAddress(to), subject, body, body);
        var resp = await client.SendEmailAsync(msg, ct);
        if (!resp.IsSuccessStatusCode)
        {
            _logger.LogWarning("SendGrid response: {Status}", resp.StatusCode);
        }
    }

    public async Task ProcessQueueAsync(CancellationToken ct)
    {
        while (await Channel.Reader.WaitToReadAsync(ct))
        {
            while (Channel.Reader.TryRead(out var message))
            {
                try
                {
                    await SendAsync(message.To, message.Subject, message.Body, ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send email to {To}", message.To);
                }
            }
        }
    }
}

public record EmailMessage(string To, string Subject, string Body);
