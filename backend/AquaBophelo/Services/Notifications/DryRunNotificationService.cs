using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Notifications;

public class DryRunNotificationService : INotificationService
{
    private readonly AppDbContext _context;
    private readonly ILogger<DryRunNotificationService> _logger;

    public DryRunNotificationService(AppDbContext context, ILogger<DryRunNotificationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> DispatchAlertNotificationsAsync(Alert alert)
    {
        // Fetch active subscriptions matching alert area (or all if alert has no area constraint)
        var subscriptionsQuery = _context.AlertSubscriptions
            .Include(s => s.User)
            .Include(s => s.Area)
            .Where(s => s.IsActive);

        if (alert.AreaId.HasValue)
        {
            subscriptionsQuery = subscriptionsQuery.Where(s => s.AreaId == alert.AreaId.Value);
        }

        var subscriptions = await subscriptionsQuery.ToListAsync();
        var dispatchedLogs = new List<NotificationLog>();

        if (subscriptions.Count == 0)
        {
            _logger.LogInformation("No active subscriptions found for alert {AlertId} in Area {AreaId}.", alert.Id, alert.AreaId);

            // Create a general broadcast log record for audit
            var auditLog = new NotificationLog
            {
                AlertId = alert.Id,
                UserId = alert.CreatedByUserId,
                Channel = "Email",
                Status = "DryRun",
                Error = "No active resident subscribers registered for area",
                SentAt = DateTime.UtcNow
            };
            _context.NotificationLogs.Add(auditLog);
            await _context.SaveChangesAsync();
            return 0;
        }

        foreach (var sub in subscriptions)
        {
            var log = new NotificationLog
            {
                AlertId = alert.Id,
                UserId = sub.UserId,
                Channel = sub.Channel,
                Status = "Sent",
                Error = null,
                SentAt = DateTime.UtcNow
            };
            dispatchedLogs.Add(log);

            _logger.LogInformation(
                "[NOTIFICATION DISPATCH] Alert '{Title}' ({Severity}) sent to User '{User}' via {Channel}. [Area: {Area}]",
                alert.Title,
                alert.Severity,
                sub.User?.Email ?? sub.UserId,
                sub.Channel,
                sub.Area?.Name ?? "All Areas"
            );
        }

        _context.NotificationLogs.AddRange(dispatchedLogs);
        await _context.SaveChangesAsync();

        return dispatchedLogs.Count;
    }

    public async Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(int? alertId = null)
    {
        var query = _context.NotificationLogs
            .Include(n => n.Alert)
            .Include(n => n.User)
            .AsQueryable();

        if (alertId.HasValue)
        {
            query = query.Where(n => n.AlertId == alertId.Value);
        }

        return await query.OrderByDescending(n => n.SentAt).ToListAsync();
    }
}
