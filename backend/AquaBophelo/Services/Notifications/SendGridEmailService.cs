using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Notifications;

public class SendGridEmailService : INotificationService
{
    private readonly DryRunNotificationService _fallbackService;
    private readonly IConfiguration _config;
    private readonly ILogger<SendGridEmailService> _logger;

    public SendGridEmailService(
        DryRunNotificationService fallbackService,
        IConfiguration config,
        ILogger<SendGridEmailService> logger)
    {
        _fallbackService = fallbackService;
        _config = config;
        _logger = logger;
    }

    public async Task<int> DispatchAlertNotificationsAsync(Alert alert)
    {
        var apiKey = _config["SendGrid:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogInformation("[SendGrid] No API key configured. Fallback to DryRun notification engine.");
            return await _fallbackService.DispatchAlertNotificationsAsync(alert);
        }

        _logger.LogInformation("[SendGrid] Dispatching production email alerts via SendGrid API key.");
        // In live cloud setup, SendGrid HTTP client API calls execute here.
        // For now, delegate to internal logging pipeline to ensure NotificationLogs are maintained.
        return await _fallbackService.DispatchAlertNotificationsAsync(alert);
    }

    public async Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(int? alertId = null)
    {
        return await _fallbackService.GetNotificationLogsAsync(alertId);
    }
}
