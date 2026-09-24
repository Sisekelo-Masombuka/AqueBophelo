using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Trucks;
using AquaBophelo.Models;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class TrucksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public TrucksController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    
    
    /// Retrieves all trucks with current status, driver info and GPS location
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TruckResponseDto>>> GetAll()
    {
        var trucks = await _context.Trucks
            .Include(t => t.Driver)
            .AsNoTracking()
            .Select(t => MapToDto(t))
            .ToListAsync();

        return Ok(trucks);
    }

    
    /// Retrieves a single truck by ID
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TruckResponseDto>> GetById(int id)
    {
        var truck = await _context.Trucks
            .Include(t => t.Driver)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (truck == null)
        {
            return NotFound(new { message = $"Truck with ID {id} was not found." });
        }

        return Ok(MapToDto(truck));
    }

    
    /// Registers a new water tanker in the municipal fleet
    
    [HttpPost]
    public async Task<ActionResult<TruckResponseDto>> Create([FromBody] CreateTruckDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if registration number already exists
        var exists = await _context.Trucks
            .AnyAsync(t => t.RegistrationNumber.ToUpper() == dto.RegistrationNumber.Trim().ToUpper());

        if (exists)
        {
            return BadRequest(new { message = $"A truck with registration number '{dto.RegistrationNumber}' already exists." });
        }

        var truck = new Truck
        {
            RegistrationNumber = dto.RegistrationNumber.Trim().ToUpper(),
            CapacityLitres = dto.CapacityLitres,
            Status = "Available"
        };

        _context.Trucks.Add(truck);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = truck.Id }, MapToDto(truck));
    }

    
    /// Updates capacity and operational status of a truck
    
    [HttpPut("{id:int}")]
    public async Task<ActionResult<TruckResponseDto>> Update(int id, [FromBody] UpdateTruckDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var truck = await _context.Trucks
            .Include(t => t.Driver)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (truck == null)
        {
            return NotFound(new { message = $"Truck with ID {id} was not found." });
        }

        truck.CapacityLitres = dto.CapacityLitres;
        truck.Status = dto.Status;

        await _context.SaveChangesAsync();

        return Ok(MapToDto(truck));
    }

    
    /// Assigns or unassigns a driver to a truck
    
    [HttpPut("{id:int}/driver")]
    public async Task<ActionResult<TruckResponseDto>> AssignDriver(int id, [FromBody] AssignDriverDto dto)
    {
        var truck = await _context.Trucks
            .Include(t => t.Driver)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (truck == null)
        {
            return NotFound(new { message = $"Truck with ID {id} was not found." });
        }

        if (string.IsNullOrWhiteSpace(dto.DriverId))
        {
            // Unassign driver
            truck.DriverId = null;
            truck.Driver = null;
        }
        else
        {
            var driver = await _userManager.FindByIdAsync(dto.DriverId);
            if (driver == null)
            {
                return BadRequest(new { message = $"Driver with ID '{dto.DriverId}' was not found." });
            }

            var isDriver = await _userManager.IsInRoleAsync(driver, "Driver");
            if (!isDriver)
            {
                return BadRequest(new { message = $"User '{driver.FullName}' does not have the 'Driver' role." });
            }

            truck.DriverId = driver.Id;
            truck.Driver = driver;
        }

        await _context.SaveChangesAsync();

        return Ok(MapToDto(truck));
    }

    private static TruckResponseDto MapToDto(Truck truck)
    {
        return new TruckResponseDto
        {
            Id = truck.Id,
            RegistrationNumber = truck.RegistrationNumber,
            CapacityLitres = truck.CapacityLitres,
            Status = truck.Status,
            DriverId = truck.DriverId,
            DriverName = truck.Driver?.FullName,
            LastLatitude = truck.LastLatitude,
            LastLongitude = truck.LastLongitude,
            LastSeenAt = truck.LastSeenAt
        };
    }
}
