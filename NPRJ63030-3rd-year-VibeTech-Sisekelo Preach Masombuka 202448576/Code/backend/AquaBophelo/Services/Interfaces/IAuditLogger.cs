namespace AquaBophelo.Services.Interfaces;

public interface IAuditLogger
{
    Task LogAsync(
        string action,
        string category,
        string details,
        string? userId = null,
        string? userEmail = null,
        string? userRole = null,
        string? entityName = null,
        string? entityId = null,
        string? ipAddress = null);
}
