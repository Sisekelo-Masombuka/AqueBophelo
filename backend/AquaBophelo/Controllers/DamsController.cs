using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Dtos.Dams;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DamsController : ControllerBase
{
    private readonly IDamService _damService;

    public DamsController(IDamService damService)
    {
        _damService = damService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<DamResponseDto>>> GetAllDams()
    {
        var dams = await _damService.GetAllDamsAsync();
        return Ok(dams);
    }

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

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DamResponseDto>> CreateDam([FromBody] CreateDamDto dto)
    {
        var dam = await _damService.CreateDamAsync(dto);
        return CreatedAtAction(nameof(GetDamById), new { id = dam.Id }, dam);
    }

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
