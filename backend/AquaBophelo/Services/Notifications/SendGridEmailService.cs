using System.Net;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using AquaBophelo.Data;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Notifications;

public class SendGridEmailService : INotificationService
{
    private readonly DryRunNotificationService _fallbackService;
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<SendGridEmailService> _logger;

    public SendGridEmailService(
        DryRunNotificationService fallbackService,
        AppDbContext context,
        IConfiguration config,
        ILogger<SendGridEmailService> logger)
    {
        _fallbackService = fallbackService;
        _context = context;
        _config = config;
        _logger = logger;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string bodyText)
    {
        var smtpHost = _config["Smtp:Host"];
        var smtpUsername = _config["Smtp:Username"];
        var smtpPassword = _config["Smtp:Password"];

        if (!string.IsNullOrWhiteSpace(smtpHost) && !string.IsNullOrWhiteSpace(smtpUsername) && !string.IsNullOrWhiteSpace(smtpPassword))
        {
            try
            {
                int port = int.TryParse(_config["Smtp:Port"], out var p) ? p : 587;
                bool enableSsl = bool.TryParse(_config["Smtp:EnableSsl"], out var ssl) ? ssl : true;

                using var client = new SmtpClient(smtpHost, port)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = enableSsl
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpUsername, "Sol Plaatje Municipal Water Desk"),
                    Subject = subject,
                    Body = bodyText,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                _logger.LogInformation("[SmtpEmailService] Direct email dispatched to {To}", toEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[SmtpEmailService] Failed sending email to {To}", toEmail);
            }
        }

        return await _fallbackService.SendEmailAsync(toEmail, subject, bodyText);
    }

    public async Task<int> DispatchAlertNotificationsAsync(Alert alert)
    {
        var apiKey = _config["SendGrid:ApiKey"];
        var smtpHost = _config["Smtp:Host"];
        var smtpUsername = _config["Smtp:Username"];
        var smtpPassword = _config["Smtp:Password"];

        // If real SMTP credentials configured, attempt real email dispatch via System.Net.Mail
        if (!string.IsNullOrWhiteSpace(smtpHost) && !string.IsNullOrWhiteSpace(smtpUsername) && !string.IsNullOrWhiteSpace(smtpPassword))
        {
            try
            {
                _logger.LogInformation("[SmtpEmailService] Dispatching REAL email alert via SMTP server {Host}...", smtpHost);
                int port = int.TryParse(_config["Smtp:Port"], out var p) ? p : 587;
                bool enableSsl = bool.TryParse(_config["Smtp:EnableSsl"], out var ssl) ? ssl : true;

                using var client = new SmtpClient(smtpHost, port)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = enableSsl
                };

                // Gather target recipient emails
                var recipientEmails = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { smtpUsername };

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

                foreach (var recipient in recipientEmails)
                {
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(smtpUsername, "Sol Plaatje Municipal Water Desk"),
                        Subject = $"[AquaBophelo Notice] {alert.Title}",
                        Body = $"Sol Plaatje Municipal Water Alert:\n\n{alert.Title}\nSeverity: {alert.Severity}\n\n{alert.Message}\n\nTime: {alert.CreatedAt:yyyy-MM-dd HH:mm} (CAT)\nElke druppel tel • Metsi ke bophelo",
                        IsBodyHtml = false
                    };
                    mailMessage.To.Add(recipient);

                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation("[SmtpEmailService] REAL email dispatched successfully to {To}", recipient);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[SmtpEmailService] Failed to send real email via SMTP. Falling back to log engine.");
            }
        }
        else
        {
            _logger.LogInformation("[SendGrid/SMTP] Real email credentials not set in secrets. (To send real emails, set Smtp:Username and Smtp:Password via 'dotnet user-secrets set Smtp:Username ...'). Using local log engine.");
        }

        return await _fallbackService.DispatchAlertNotificationsAsync(alert);
    }

    public async Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(int? alertId = null)
    {
        return await _fallbackService.GetNotificationLogsAsync(alertId);
    }
}
