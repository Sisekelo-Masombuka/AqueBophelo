using AquaBophelo.Data;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services;

public class AuditLogger : IAuditLogger
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AuditLogger> _logger;

    public AuditLogger(IServiceScopeFactory scopeFactory, ILogger<AuditLogger> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task LogAsync(
        string action,
        string category,
        string details,
        string? userId = null,
        string? userEmail = null,
        string? userRole = null,
        string? entityName = null,
        string? entityId = null,
        string? ipAddress = null)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var entry = new SystemAuditLog
            {
                Action = action,
                Category = category,
                Details = details,
                UserId = userId,
                UserEmail = userEmail,
                UserRole = userRole,
                EntityName = entityName ?? string.Empty,
                EntityId = entityId,
                IpAddress = ipAddress,
                TimestampUtc = DateTime.UtcNow
            };

            db.AuditLogs.Add(entry);
            await db.SaveChangesAsync();

            _logger.LogInformation(
                "[AUDIT LOG RECORDED] Category={Category}, Action={Action}, User={UserEmail} ({UserId}), Entity={EntityName}:{EntityId} - {Details}",
                category, action, userEmail ?? "System", userId ?? "N/A", entityName, entityId, details);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to persist audit log entry to database: Action={Action}", action);
        }
    }
}
