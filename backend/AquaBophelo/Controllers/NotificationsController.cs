using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Models;

namespace AquaBophelo.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public NotificationsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET: api/v1/notifications
    /// Gets in-system notification history for the current authenticated user.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationLog>>> GetMyNotifications()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var notifications = await _context.NotificationLogs
            .Where(n => userId != null && n.UserId == userId)
            .OrderByDescending(n => n.SentAt)
            .Take(20)
            .AsNoTracking()
            .ToListAsync();

        return Ok(notifications);
    }

    /// <summary>
    /// PATCH: api/v1/notifications/{id}/read
    /// Marks an in-system notification as read.
    /// </summary>
    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var notification = await _context.NotificationLogs.FindAsync(id);
        if (notification == null || (userId != null && notification.UserId != userId))
        {
            return NotFound();
        }

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Notification marked as read." });
    }
}
