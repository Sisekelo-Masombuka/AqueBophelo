using AquaBophelo.Models;

namespace AquaBophelo.Services.Interfaces;

public interface INotificationService
{
    Task<bool> SendEmailAsync(string toEmail, string subject, string bodyText);
    Task<int> DispatchAlertNotificationsAsync(Alert alert);
    Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(int? alertId = null);
}
