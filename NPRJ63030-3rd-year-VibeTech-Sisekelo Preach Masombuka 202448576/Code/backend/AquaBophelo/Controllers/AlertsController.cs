using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Dtos.Alerts;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

/// <summary>
/// Manages water outage, drought warning, and emergency broadcast alerts for residents.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly IAlertService _alertService;
    private readonly INotificationService _notificationService;

    public AlertsController(IAlertService alertService, INotificationService notificationService)
    {
        _alertService = alertService;
        _notificationService = notificationService;
    }

    /// <summary>
    /// Retrieves active municipal alerts, optionally filtered by supply area or alert type.
    /// </summary>
    /// <param name="areaId">Optional area ID filter.</param>
    /// <param name="type">Optional alert type filter (e.g. Outage, Drought, Maintenance).</param>
    /// <returns>A collection of matching alert notices.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAlerts([FromQuery] int? areaId, [FromQuery] string? type)
    {
        var alerts = await _alertService.GetAlertsAsync(areaId, type);
        return Ok(alerts);
    }

    /// <summary>
    /// Retrieves a single alert notice by its unique ID.
    /// </summary>
    /// <param name="id">The unique alert ID.</param>
    /// <returns>The alert notice record.</returns>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAlertById(int id)
    {
        var alert = await _alertService.GetAlertByIdAsync(id);
        if (alert == null) return NotFound(new { message = $"Alert with ID {id} not found." });
        return Ok(alert);
    }

    /// <summary>
    /// Broadcasts a new municipal water alert and enqueues resident email dispatches (Admin only).
    /// </summary>
    /// <param name="dto">The alert creation payload.</param>
    /// <returns>The created alert record.</returns>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateAlert([FromBody] CreateAlertDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var alert = await _alertService.CreateAlertAsync(dto, userId);
        return CreatedAtAction(nameof(GetAlertById), new { id = alert.Id }, alert);
    }

    /// <summary>
    /// Retrieves notification delivery logs for audits and diagnostic inspection (Admin only).
    /// </summary>
    /// <param name="alertId">Optional alert ID filter.</param>
    /// <returns>A collection of notification delivery logs.</returns>
    [Authorize(Roles = "Admin")]
    [HttpGet("logs")]
    public async Task<IActionResult> GetNotificationLogs([FromQuery] int? alertId)
    {
        var logs = await _notificationService.GetNotificationLogsAsync(alertId);
        return Ok(logs);
    }
}
