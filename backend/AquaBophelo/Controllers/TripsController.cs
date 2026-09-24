using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Trips;
using AquaBophelo.Models;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class TripsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public TripsController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    /// <summary>
    /// GET: api/v1/trips
    /// Retrieves all trips ordered by most recent first
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripResponseDto>>> GetAll()
    {
        var trips = await _context.Trips
            .Include(t => t.Truck)
            .Include(t => t.Driver)
            .Include(t => t.Route)
            .Include(t => t.TripStops)
                .ThenInclude(ts => ts.RouteStop)
            .OrderByDescending(t => t.StartedAt)
            .AsNoTracking()
            .ToListAsync();

        return Ok(trips.Select(t => MapToDto(t)));
    }

    /// <summary>
    /// GET: api/v1/trips/active
    /// Retrieves only currently active trips on the road
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<TripResponseDto>>> GetActive()
    {
        var activeTrips = await _context.Trips
            .Include(t => t.Truck)
            .Include(t => t.Driver)
            .Include(t => t.Route)
            .Include(t => t.TripStops)
                .ThenInclude(ts => ts.RouteStop)
            .Where(t => t.Status == "Active")
            .OrderByDescending(t => t.StartedAt)
            .AsNoTracking()
            .ToListAsync();

        return Ok(activeTrips.Select(t => MapToDto(t)));
    }

    /// <summary>
    /// GET: api/v1/trips/{id}
    /// Retrieves a single trip by ID with stops and progress
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TripResponseDto>> GetById(int id)
    {
        var trip = await _context.Trips
            .Include(t => t.Truck)
            .Include(t => t.Driver)
            .Include(t => t.Route)
            .Include(t => t.TripStops)
                .ThenInclude(ts => ts.RouteStop)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (trip == null)
        {
            return NotFound(new { message = $"Trip with ID {id} was not found." });
        }

        return Ok(MapToDto(trip));
    }

    /// <summary>
    /// POST: api/v1/trips
    /// Schedules and starts a new water delivery trip
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TripResponseDto>> Create([FromBody] CreateTripDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // 1. Verify truck exists
        var truck = await _context.Trucks.FindAsync(dto.TruckId);
        if (truck == null)
        {
            return BadRequest(new { message = $"Truck with ID {dto.TruckId} was not found." });
        }

        // 2. Check if truck is already active on another trip
        var isTruckBusy = await _context.Trips.AnyAsync(t => t.TruckId == dto.TruckId && t.Status == "Active");
        if (isTruckBusy)
        {
            return BadRequest(new { message = $"Truck '{truck.RegistrationNumber}' is already on an active trip." });
        }

        // 3. Verify driver exists and has Driver role (supports GUID or email address)
        var driver = await _userManager.FindByIdAsync(dto.DriverId)
                     ?? await _userManager.FindByEmailAsync(dto.DriverId);

        if (driver == null)
        {
            return BadRequest(new { message = $"Driver '{dto.DriverId}' was not found. Please provide a valid Driver ID or Email address." });
        }

        var isDriver = await _userManager.IsInRoleAsync(driver, "Driver");
        if (!isDriver)
        {
            return BadRequest(new { message = $"User '{driver.FullName}' does not have the 'Driver' role." });
        }

        // 4. Verify route exists and load its stops
        var route = await _context.Routes
            .Include(r => r.Stops)
            .FirstOrDefaultAsync(r => r.Id == dto.RouteId);

        if (route == null)
        {
            return BadRequest(new { message = $"Route with ID {dto.RouteId} was not found." });
        }

        // 5. Create trip and auto-generate trip stops from the route
        var trip = new Trip
        {
            TruckId = dto.TruckId,
            DriverId = driver.Id,
            RouteId = dto.RouteId,
            StartedAt = DateTime.UtcNow,
            Status = "Active"
        };

        if (route.Stops != null && route.Stops.Any())
        {
            foreach (var stop in route.Stops.OrderBy(s => s.Sequence))
            {
                trip.TripStops.Add(new TripStop
                {
                    RouteStopId = stop.Id,
                    Completed = false
                });
            }
        }

        // Update truck operational status
        truck.Status = "OnTrip";
        truck.DriverId = driver.Id;

        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        // Reload relationships for DTO response
        await _context.Entry(trip).Reference(t => t.Truck).LoadAsync();
        await _context.Entry(trip).Reference(t => t.Driver).LoadAsync();
        await _context.Entry(trip).Reference(t => t.Route).LoadAsync();
        await _context.Entry(trip).Collection(t => t.TripStops).Query()
            .Include(ts => ts.RouteStop)
            .LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = trip.Id }, MapToDto(trip));
    }

    /// <summary>
    /// POST: api/v1/trips/{id}/stops/{stopId}/complete
    /// Marks a specific delivery stop as completed by the driver
    /// </summary>
    [HttpPost("{id:int}/stops/{stopId:int}/complete")]
    public async Task<IActionResult> CompleteStop(int id, int stopId)
    {
        var tripStop = await _context.TripStops
            .Include(ts => ts.RouteStop)
            .FirstOrDefaultAsync(ts => ts.TripId == id && ts.Id == stopId);

        if (tripStop == null)
        {
            return NotFound(new { message = $"Stop with ID {stopId} for Trip {id} was not found." });
        }

        tripStop.Completed = true;
        tripStop.ArrivedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Stop '{tripStop.RouteStop?.Name ?? stopId.ToString()}' marked as completed.",
            stopId = tripStop.Id,
            completed = true,
            arrivedAt = tripStop.ArrivedAt,
            arrivedAtFormatted = tripStop.ArrivedAt?.AddHours(2).ToString("dd MMM yyyy, hh:mm tt") + " (CAT)"
        });
    }

    /// <summary>
    /// POST: api/v1/trips/{id}/end
    /// Ends an active delivery trip and sets the truck back to Available
    /// </summary>
    [HttpPost("{id:int}/end")]
    public async Task<ActionResult<TripResponseDto>> EndTrip(int id)
    {
        var trip = await _context.Trips
            .Include(t => t.Truck)
            .Include(t => t.Driver)
            .Include(t => t.Route)
            .Include(t => t.TripStops)
                .ThenInclude(ts => ts.RouteStop)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (trip == null)
        {
            return NotFound(new { message = $"Trip with ID {id} was not found." });
        }

        if (trip.Status != "Active")
        {
            return BadRequest(new { message = $"Trip {id} is not currently active (Current status: {trip.Status})." });
        }

        trip.Status = "Completed";
        trip.EndedAt = DateTime.UtcNow;

        if (trip.Truck != null)
        {
            trip.Truck.Status = "Available";
        }

        await _context.SaveChangesAsync();

        return Ok(MapToDto(trip));
    }

    private static TripResponseDto MapToDto(Trip trip)
    {
        return new TripResponseDto
        {
            Id = trip.Id,
            TruckId = trip.TruckId,
            TruckRegistration = trip.Truck?.RegistrationNumber ?? string.Empty,
            DriverId = trip.DriverId,
            DriverName = trip.Driver?.FullName,
            RouteId = trip.RouteId,
            RouteName = trip.Route?.Name,
            StartedAt = trip.StartedAt,
            EndedAt = trip.EndedAt,
            Status = trip.Status,
            Stops = trip.TripStops
                .OrderBy(ts => ts.RouteStop?.Sequence ?? 0)
                .Select(ts => new TripStopResponseDto
                {
                    Id = ts.Id,
                    TripId = ts.TripId,
                    RouteStopId = ts.RouteStopId,
                    StopName = ts.RouteStop?.Name ?? string.Empty,
                    Latitude = ts.RouteStop?.Latitude ?? 0,
                    Longitude = ts.RouteStop?.Longitude ?? 0,
                    Sequence = ts.RouteStop?.Sequence ?? 0,
                    ArrivedAt = ts.ArrivedAt,
                    Completed = ts.Completed
                })
                .ToList()
        };
    }
}
