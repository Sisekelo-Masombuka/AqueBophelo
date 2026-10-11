using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using AquaBophelo.Configuration;
using AquaBophelo.Data;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Notifications;

public class BrevoEmailSender : IEmailSender, INotificationService
{
    private readonly HttpClient _httpClient;
    private readonly BrevoOptions _options;
    private readonly DryRunNotificationService _fallbackService;
    private readonly AppDbContext _context;
    private readonly IEmailQueue _emailQueue;
    private readonly ILogger<BrevoEmailSender> _logger;

    public BrevoEmailSender(
        HttpClient httpClient,
        IOptions<BrevoOptions> options,
        DryRunNotificationService fallbackService,
        AppDbContext context,
        IEmailQueue emailQueue,
        ILogger<BrevoEmailSender> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _fallbackService = fallbackService;
        _context = context;
        _emailQueue = emailQueue;
        _logger = logger;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string htmlContent, string? plainTextContent = null)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey) || string.IsNullOrWhiteSpace(_options.SenderEmail))
        {
            _logger.LogWarning("[BrevoEmailSender] Brevo API Key or Sender Email is not configured. Falling back to local dry-run logger.");
            return await _fallbackService.SendEmailAsync(toEmail, subject, plainTextContent ?? htmlContent);
        }

        try
        {
            var requestPayload = new
            {
                sender = new
                {
                    name = string.IsNullOrWhiteSpace(_options.SenderName) ? "Sol Plaatje Municipal Water Desk" : _options.SenderName,
                    email = _options.SenderEmail
                },
                to = new[]
                {
                    new { email = toEmail }
                },
                subject = subject,
                htmlContent = htmlContent,
                textContent = plainTextContent ?? htmlContent
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestPayload), Encoding.UTF8, "application/json");

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
            request.Headers.Add("api-key", _options.ApiKey);
            request.Headers.Add("accept", "application/json");
            request.Content = jsonContent;

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("[BrevoEmailSender] Transactional email successfully dispatched via Brevo API to recipient domain.");
                return true;
            }

            var errorResponseBody = await response.Content.ReadAsStringAsync();
            _logger.LogError("[BrevoEmailSender] Brevo API returned status code {StatusCode}. Error details: {Error}", response.StatusCode, errorResponseBody);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[BrevoEmailSender] Exception occurred while calling Brevo Transactional Email API.");
        }

        return await _fallbackService.SendEmailAsync(toEmail, subject, plainTextContent ?? htmlContent);
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string bodyText)
    {
        return await SendEmailAsync(toEmail, subject, $"<p>{System.Net.WebUtility.HtmlEncode(bodyText)}</p>", bodyText);
    }

    public async Task<int> DispatchAlertNotificationsAsync(Alert alert)
    {
        var recipientEmails = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        var subscriptions = await _context.AlertSubscriptions
            .Include(s => s.User)
            .Where(s => s.IsActive && (!alert.AreaId.HasValue || s.AreaId == alert.AreaId.Value))
            .ToListAsync();

        foreach (var sub in subscriptions)
        {
            if (!string.IsNullOrWhiteSpace(sub.User?.Email))
            {
                recipientEmails.Add(sub.User.Email);
            }
        }

        int enqueuedCount = 0;
        string priority = alert.Severity == "Critical" ? "Critical" : "Normal";

        foreach (var recipient in recipientEmails)
        {
            string subject = $"[AquaBophelo Notice] {alert.Title}";
            string html = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px; color: #0f223d;'>
                    <h2 style='color: #152e52;'>Sol Plaatje Municipal Water Notice</h2>
                    <h3 style='color: #1d70b8;'>{System.Net.WebUtility.HtmlEncode(alert.Title)}</h3>
                    <p><strong>Severity:</strong> {alert.Severity}</p>
                    <p>{System.Net.WebUtility.HtmlEncode(alert.Message)}</p>
                    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                    <p style='font-size: 12px; color: #64748b;'>Sol Plaatje Municipality &bull; Elke druppel tel &bull; Metsi ke bophelo</p>
                </div>";

            _emailQueue.EnqueueEmail(new EmailWorkItem
            {
                ToEmail = recipient,
                Subject = subject,
                HtmlContent = html,
                PlainTextContent = alert.Message,
                Priority = priority
            });
            enqueuedCount++;
        }

        _logger.LogInformation("[BrevoEmailSender] Enqueued {Count} alert emails into background queue with priority '{Priority}'.", enqueuedCount, priority);
        await _fallbackService.DispatchAlertNotificationsAsync(alert);
        return enqueuedCount;
    }

    public async Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(int? alertId = null)
    {
        return await _fallbackService.GetNotificationLogsAsync(alertId);
    }
}
