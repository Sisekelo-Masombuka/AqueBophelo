using AquaBophelo.Models;

namespace AquaBophelo.Services.Interfaces;

public interface INotificationService
{
    Task<int> DispatchAlertNotificationsAsync(Alert alert);
    Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(int? alertId = null);
}
