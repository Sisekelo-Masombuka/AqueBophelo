using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OutagesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public OutagesController(AppDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    /// <summary>
    /// GET: api/v1/outages
    /// Returns list of scheduled water interruptions (cut-off time & expected return time)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ScheduledOutage>>> GetOutages()
    {
        var outages = await _context.ScheduledOutages
            .OrderByDescending(o => o.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

        return Ok(outages);
    }

    /// <summary>
    /// POST: api/v1/outages
    /// Allows Admin to post a scheduled water interruption (cut-off time & expected return time)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ScheduledOutage>> CreateOutage([FromBody] CreateOutageDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.AreaName))
        {
            return BadRequest(new { message = "Title and AreaName are required." });
        }

        var outage = new ScheduledOutage
        {
            Title = dto.Title,
            AreaName = dto.AreaName,
            CutOffTime = dto.CutOffTime,
            ExpectedReturnTime = dto.ExpectedReturnTime,
            Description = dto.Description,
            PostedBy = User.Identity?.Name ?? "Sol Plaatje Municipal Admin",
            CreatedAt = DateTime.UtcNow
        };

        _context.ScheduledOutages.Add(outage);
        await _context.SaveChangesAsync();

        // Broadcast real email to subscribed residents in the affected area
        var affectedSubscribers = await _context.Users
            .Where(u => u.OptInEmailAlerts && !string.IsNullOrEmpty(u.Email))
            .Select(u => u.Email)
            .ToListAsync();

        foreach (var email in affectedSubscribers)
        {
            await _notificationService.SendEmailAsync(
                email,
                $"Sol Plaatje Water Notice: {outage.Title}",
                $"<div style='font-family:sans-serif;'><h2>Scheduled Water Interruption Notice</h2><p><strong>Area:</strong> {outage.AreaName}</p><p><strong>Cut-Off Time:</strong> {outage.CutOffTime:yyyy-MM-dd HH:mm}</p><p><strong>Expected Return Time:</strong> {outage.ExpectedReturnTime:yyyy-MM-dd HH:mm}</p><p>{outage.Description}</p><hr/><p><em>Sol Plaatje Municipality Water Desk</em></p></div>"
            );
        }

        return CreatedAtAction(nameof(GetOutages), new { id = outage.Id }, outage);
    }

    /// <summary>
    /// DELETE: api/v1/outages/{id}
    /// Admin removes a scheduled outage.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteOutage(int id)
    {
        var outage = await _context.ScheduledOutages.FindAsync(id);
        if (outage == null) return NotFound();

        _context.ScheduledOutages.Remove(outage);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Scheduled outage deleted successfully." });
    }
}

public class CreateOutageDto
{
    public string Title { get; set; } = string.Empty;
    public string AreaName { get; set; } = string.Empty;
    public DateTime CutOffTime { get; set; }
    public DateTime ExpectedReturnTime { get; set; }
    public string Description { get; set; } = string.Empty;
}
