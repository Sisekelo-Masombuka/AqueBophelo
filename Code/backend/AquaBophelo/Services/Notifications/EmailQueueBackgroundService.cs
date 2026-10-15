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
        _emailQueue.RecordHeartbeat();

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                EmailWorkItem workItem;
                try
                {
                    // Dequeue with a 30s timeout so idle worker loop periodically refreshes its liveness heartbeat
                    using var dequeueTimeoutCts = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
                    dequeueTimeoutCts.CancelAfter(TimeSpan.FromSeconds(30));
                    workItem = await _emailQueue.DequeueAsync(dequeueTimeoutCts.Token);
                }
                catch (OperationCanceledException) when (!stoppingToken.IsCancellationRequested)
                {
                    // Queue was empty for 30s; refresh worker liveness heartbeat and wait again
                    _emailQueue.RecordHeartbeat();
                    continue;
                }

                _emailQueue.RecordHeartbeat();

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

                try
                {
                    var sendTask = emailSender.SendEmailAsync(
                        workItem.ToEmail,
                        workItem.Subject,
                        workItem.HtmlContent,
                        workItem.PlainTextContent
                    );

                    // Enforce 30-second maximum send timeout to ensure worker never hangs on stalled sockets
                    bool success = await sendTask.WaitAsync(TimeSpan.FromSeconds(30), stoppingToken);

                    if (success)
                    {
                        _emailQueue.RecordEmailSent();
                        _emailQueue.RecordDeliverySuccess();
                        _logger.LogInformation("[EmailQueueBackgroundService] Background email successfully delivered to {To}. Daily total: {DailyCount}", workItem.ToEmail, _emailQueue.GetDailySentCount());
                    }
                    else
                    {
                        _emailQueue.RecordDeliveryFailure("EmailSender returned false");
                        _logger.LogWarning("[EmailQueueBackgroundService] Email sending returned false for {To}. Consecutive failures: {Failures}", workItem.ToEmail, _emailQueue.ConsecutiveFailureCount);
                    }
                }
                catch (TimeoutException)
                {
                    _emailQueue.RecordDeliveryFailure("Email delivery timed out after 30 seconds");
                    _logger.LogError("[EmailQueueBackgroundService] Email delivery to {To} timed out after 30 seconds. Consecutive failures: {Failures}", workItem.ToEmail, _emailQueue.ConsecutiveFailureCount);
                }
                catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
                {
                    _emailQueue.RecordDeliveryFailure(ex.Message);
                    _logger.LogError(ex, "[EmailQueueBackgroundService] Exception occurred delivering email to {To}. Consecutive failures: {Failures}", workItem.ToEmail, _emailQueue.ConsecutiveFailureCount);
                }
                finally
                {
                    _emailQueue.RecordHeartbeat();
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[EmailQueueBackgroundService] Unexpected error in worker loop.");
                _emailQueue.RecordHeartbeat();
            }
        }

        _logger.LogInformation("[EmailQueueBackgroundService] Background email processor stopped.");
    }
}
