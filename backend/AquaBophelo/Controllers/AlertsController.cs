using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Dtos.Alerts;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

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

    [HttpGet]
    public async Task<IActionResult> GetAlerts([FromQuery] int? areaId, [FromQuery] string? type)
    {
        var alerts = await _alertService.GetAlertsAsync(areaId, type);
        return Ok(alerts);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAlertById(int id)
    {
        var alert = await _alertService.GetAlertByIdAsync(id);
        if (alert == null) return NotFound(new { message = $"Alert with ID {id} not found." });
        return Ok(alert);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateAlert([FromBody] CreateAlertDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var alert = await _alertService.CreateAlertAsync(dto, userId);
        return CreatedAtAction(nameof(GetAlertById), new { id = alert.Id }, alert);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("logs")]
    public async Task<IActionResult> GetNotificationLogs([FromQuery] int? alertId)
    {
        var logs = await _notificationService.GetNotificationLogsAsync(alertId);
        return Ok(logs);
    }
}
