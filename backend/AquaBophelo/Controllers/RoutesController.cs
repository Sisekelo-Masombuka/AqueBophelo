using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Routes;
using AquaBophelo.Models;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoutesController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET: api/v1/routes
    /// Retrieves all delivery routes with their ordered stops and municipal area
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RouteResponseDto>>> GetAll()
    {
        var routes = await _context.Routes
            .Include(r => r.Area)
            .Include(r => r.Stops)
            .AsNoTracking()
            .ToListAsync();

        var dtos = routes.Select(r => MapToDto(r)).ToList();
        return Ok(dtos);
    }

    /// <summary>
    /// GET: api/v1/routes/{id}
    /// Retrieves a single route by ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<RouteResponseDto>> GetById(int id)
    {
        var route = await _context.Routes
            .Include(r => r.Area)
            .Include(r => r.Stops)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (route == null)
        {
            return NotFound(new { message = $"Route with ID {id} was not found." });
        }

        return Ok(MapToDto(route));
    }

    /// <summary>
    /// POST: api/v1/routes
    /// Creates a new delivery route with ordered stops
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<RouteResponseDto>> Create([FromBody] CreateRouteDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (dto.AreaId.HasValue)
        {
            var areaExists = await _context.Areas.AnyAsync(a => a.Id == dto.AreaId.Value);
            if (!areaExists)
            {
                return BadRequest(new { message = $"Area with ID {dto.AreaId.Value} was not found." });
            }
        }

        var route = new TruckRoute
        {
            Name = dto.Name.Trim(),
            AreaId = dto.AreaId
        };

        if (dto.Stops != null && dto.Stops.Any())
        {
            foreach (var stopDto in dto.Stops.OrderBy(s => s.Sequence))
            {
                route.Stops.Add(new RouteStop
                {
                    Name = stopDto.Name.Trim(),
                    Latitude = stopDto.Latitude,
                    Longitude = stopDto.Longitude,
                    Sequence = stopDto.Sequence
                });
            }
        }

        _context.Routes.Add(route);
        await _context.SaveChangesAsync();

        // Reload to include Area navigation property
        await _context.Entry(route).Reference(r => r.Area).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = route.Id }, MapToDto(route));
    }

    /// <summary>
    /// DELETE: api/v1/routes/{id}
    /// Deletes a route and its stops
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var route = await _context.Routes
            .Include(r => r.Stops)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (route == null)
        {
            return NotFound(new { message = $"Route with ID {id} was not found." });
        }

        _context.Routes.Remove(route);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static RouteResponseDto MapToDto(TruckRoute route)
    {
        return new RouteResponseDto
        {
            Id = route.Id,
            Name = route.Name,
            AreaId = route.AreaId,
            AreaName = route.Area?.Name,
            Stops = route.Stops
                .OrderBy(s => s.Sequence)
                .Select(s => new RouteStopResponseDto
                {
                    Id = s.Id,
                    RouteId = s.RouteId,
                    Name = s.Name,
                    Latitude = s.Latitude,
                    Longitude = s.Longitude,
                    Sequence = s.Sequence
                })
                .ToList()
        };
    }
}
