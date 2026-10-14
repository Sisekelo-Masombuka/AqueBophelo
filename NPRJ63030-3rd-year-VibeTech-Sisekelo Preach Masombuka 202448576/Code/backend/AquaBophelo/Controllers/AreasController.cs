using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Areas;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AreasController : ControllerBase
{
    private readonly AppDbContext _context;

    public AreasController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET: api/v1/areas
    /// Retrieves all Sol Plaatje municipal areas (e.g. Galeshewe, Kimberley Central, Roodepan)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AreaResponseDto>>> GetAll()
    {
        var areas = await _context.Areas
            .AsNoTracking()
            .Select(a => new AreaResponseDto
            {
                Id = a.Id,
                Name = a.Name,
                Latitude = a.Latitude,
                Longitude = a.Longitude
            })
            .ToListAsync();

        return Ok(areas);
    }

    /// <summary>
    /// GET: api/v1/areas/{id}
    /// Retrieves a single municipal area by ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AreaResponseDto>> GetById(int id)
    {
        var area = await _context.Areas
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        if (area == null)
        {
            return NotFound(new { message = $"Area with ID {id} was not found." });
        }

        return Ok(new AreaResponseDto
        {
            Id = area.Id,
            Name = area.Name,
            Latitude = area.Latitude,
            Longitude = area.Longitude
        });
    }
}
