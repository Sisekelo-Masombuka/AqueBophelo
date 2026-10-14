using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Dtos.Dams;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

/// <summary>
/// Manages municipal reservoir and dam water level telemetry readings.
/// </summary>
[ApiController]
[Route("api/v1/dams/{damId:int}/readings")]
public class DamReadingsController : ControllerBase
{
    private readonly IDamService _damService;

    public DamReadingsController(IDamService damService)
    {
        _damService = damService;
    }

    /// <summary>
    /// Retrieves historical water level telemetry readings for a specific dam over a given day window.
    /// </summary>
    /// <param name="damId">The unique ID of the dam (e.g. 1 for Riverton Weir, 2 for Newton Reservoir).</param>
    /// <param name="days">Number of past days of telemetry to return (defaults to 30 days).</param>
    /// <returns>A collection of historical dam readings with percentage, volume in megalitres, and timestamps.</returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<DamReadingResponseDto>>> GetReadings(int damId, [FromQuery] int days = 30)
    {
        var readings = await _damService.GetDamReadingsAsync(damId, days);
        return Ok(readings);
    }

    /// <summary>
    /// Logs a new water level reading for a dam and evaluates threshold alert rules (Admin only).
    /// </summary>
    /// <param name="damId">The unique ID of the target dam.</param>
    /// <param name="dto">The telemetry payload including level percentage and source.</param>
    /// <returns>The created dam reading record.</returns>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DamReadingResponseDto>> AddReading(int damId, [FromBody] CreateDamReadingDto dto)
    {
        try
        {
            var reading = await _damService.AddDamReadingAsync(damId, dto);
            return CreatedAtAction(nameof(GetReadings), new { damId }, reading);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
