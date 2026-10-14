using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class AuditLogsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuditLogger _auditLogger;

    public AuditLogsController(AppDbContext context, IAuditLogger auditLogger)
    {
        _context = context;
        _auditLogger = auditLogger;
    }

    /// <summary>
    /// GET: api/v1/auditlogs
    /// Retrieves full database audit logs for administrative inspection
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAuditLogs([FromQuery] string? category, [FromQuery] string? userId, [FromQuery] int limit = 100)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(l => l.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(userId))
        {
            query = query.Where(l => l.UserId == userId);
        }

        var logs = await query
            .OrderByDescending(l => l.TimestampUtc)
            .Take(Math.Min(limit, 500))
            .AsNoTracking()
            .ToListAsync();

        return Ok(logs);
    }

    /// <summary>
    /// GET: api/v1/auditlogs/soft-deleted-users
    /// Lists all soft-deleted user accounts currently in the 30-day grace period
    /// </summary>
    [HttpGet("soft-deleted-users")]
    public async Task<IActionResult> GetSoftDeletedUsers()
    {
        var deletedUsers = await _context.Users
            .IgnoreQueryFilters()
            .Where(u => u.IsDeleted)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FullName,
                u.DeletedAt,
                u.ScheduledPermanentDeletionAt,
                DaysRemaining = u.ScheduledPermanentDeletionAt.HasValue
                    ? (int)Math.Max(0, (u.ScheduledPermanentDeletionAt.Value - DateTime.UtcNow).TotalDays)
                    : 0
            })
            .AsNoTracking()
            .ToListAsync();

        return Ok(deletedUsers);
    }

    /// <summary>
    /// POST: api/v1/auditlogs/restore-user/{userId}
    /// Restores a soft-deleted user account during the 30-day grace period
    /// </summary>
    [HttpPost("restore-user/{userId}")]
    public async Task<IActionResult> RestoreUser(string userId)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsDeleted);

        if (user == null)
        {
            return NotFound(new { message = $"Soft-deleted user with ID '{userId}' was not found." });
        }

        user.IsDeleted = false;
        user.DeletedAt = null;
        user.ScheduledPermanentDeletionAt = null;

        await _context.SaveChangesAsync();

        await _auditLogger.LogAsync(
            action: "ACCOUNT_RESTORED",
            category: "Auth",
            details: $"Account for {user.Email} restored from 30-day deletion grace period.",
            userId: user.Id,
            userEmail: user.Email,
            entityName: "ApplicationUser",
            entityId: user.Id
        );

        return Ok(new { message = $"Account for '{user.Email}' has been successfully restored." });
    }
}
