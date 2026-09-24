using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Dtos.Dams;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/dams/{damId:int}/readings")]
public class DamReadingsController : ControllerBase
{
    private readonly IDamService _damService;

    public DamReadingsController(IDamService damService)
    {
        _damService = damService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<DamReadingResponseDto>>> GetReadings(int damId, [FromQuery] int days = 30)
    {
        var readings = await _damService.GetDamReadingsAsync(damId, days);
        return Ok(readings);
    }

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
