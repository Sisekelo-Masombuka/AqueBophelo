using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Dtos.Dams;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

/// <summary>
/// Manages municipal dams and reservoirs within Sol Plaatje Local Municipality.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public class DamsController : ControllerBase
{
    private readonly IDamService _damService;

    public DamsController(IDamService damService)
    {
        _damService = damService;
    }

    /// <summary>
    /// Retrieves all monitored dams with their latest capacity percentages, volume, and status bands.
    /// </summary>
    /// <returns>A collection of dams with live water telemetry summaries.</returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<DamResponseDto>>> GetAllDams()
    {
        var dams = await _damService.GetAllDamsAsync();
        return Ok(dams);
    }

    /// <summary>
    /// Retrieves full details for a single dam by ID, including its associated municipal supply area.
    /// </summary>
    /// <param name="id">The unique dam ID.</param>
    /// <returns>The dam record if found.</returns>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<DamResponseDto>> GetDamById(int id)
    {
        var dam = await _damService.GetDamByIdAsync(id);
        if (dam == null)
        {
            return NotFound(new { message = $"Dam with ID {id} not found." });
        }
        return Ok(dam);
    }

    /// <summary>
    /// Registers a new dam or reservoir in the municipal system (Admin only).
    /// </summary>
    /// <param name="dto">The creation payload with dam name, capacity in megalitres, and supply area.</param>
    /// <returns>The newly created dam record.</returns>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DamResponseDto>> CreateDam([FromBody] CreateDamDto dto)
    {
        var dam = await _damService.CreateDamAsync(dto);
        return CreatedAtAction(nameof(GetDamById), new { id = dam.Id }, dam);
    }

    /// <summary>
    /// Updates dam specifications, such as capacity or municipal supply zone (Admin only).
    /// </summary>
    /// <param name="id">The unique dam ID.</param>
    /// <param name="dto">The update payload.</param>
    /// <returns>The updated dam record.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DamResponseDto>> UpdateDam(int id, [FromBody] UpdateDamDto dto)
    {
        var updatedDam = await _damService.UpdateDamAsync(id, dto);
        if (updatedDam == null)
        {
            return NotFound(new { message = $"Dam with ID {id} not found." });
        }
        return Ok(updatedDam);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDam(int id)
    {
        var deleted = await _damService.DeleteDamAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = $"Dam with ID {id} not found." });
        }
        return NoContent();
    }
}
