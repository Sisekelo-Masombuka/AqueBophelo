using Microsoft.Extensions.Hosting;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Notifications;

public class EmailQueueBackgroundService : BackgroundService
{
    private readonly IEmailQueue _emailQueue;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<EmailQueueBackgroundService> _logger;
    private const int DailyBrevoLimit = 300;
    private const int WarningThreshold = 250;

    public EmailQueueBackgroundService(
        IEmailQueue emailQueue,
        IServiceProvider serviceProvider,
        ILogger<EmailQueueBackgroundService> logger)
    {
        _emailQueue = emailQueue;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("[EmailQueueBackgroundService] Background email processor started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var workItem = await _emailQueue.DequeueAsync(stoppingToken);

                int sentToday = _emailQueue.GetDailySentCount();

                if (sentToday >= DailyBrevoLimit && workItem.Priority != "Critical")
                {
                    _logger.LogWarning("[BrevoCapMonitor] Daily free tier limit of {Limit} emails reached ({SentToday} sent today). Skipping non-critical email to {To}.", DailyBrevoLimit, sentToday, workItem.ToEmail);
                    continue;
                }

                if (sentToday >= WarningThreshold)
                {
                    _logger.LogWarning("[BrevoCapMonitor] Warning: Approaching daily Brevo limit ({SentToday}/{Limit} sent today). Prioritizing Critical alerts.", sentToday, DailyBrevoLimit);
                }

                using var scope = _serviceProvider.CreateScope();
                var emailSender = scope.ServiceProvider.GetRequiredService<IEmailSender>();

                bool success = await emailSender.SendEmailAsync(
                    workItem.ToEmail,
                    workItem.Subject,
                    workItem.HtmlContent,
                    workItem.PlainTextContent
                );

                if (success)
                {
                    _emailQueue.RecordEmailSent();
                    _logger.LogInformation("[EmailQueueBackgroundService] Background email processed for {To}. Daily total: {DailyCount}", workItem.ToEmail, _emailQueue.GetDailySentCount());
                }
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[EmailQueueBackgroundService] Error processing background email item.");
            }
        }

        _logger.LogInformation("[EmailQueueBackgroundService] Background email processor stopped.");
    }
}
