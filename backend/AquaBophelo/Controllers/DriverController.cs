using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Models;

namespace AquaBophelo.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/[controller]")]
public class DriverController : ControllerBase
{
    private readonly AppDbContext _context;

    public DriverController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET: api/v1/driver/today-trip
    /// Section 2.1.1 - 2.1.5: Get today's assigned trip, vehicle info, delivery stops, next destination, and ETAs.
    /// </summary>
    [HttpGet("today-trip")]
    public async Task<IActionResult> GetTodayTrip()
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var driverEmail = User.FindFirstValue(ClaimTypes.Email);

        var trip = await _context.Trips
            .Include(t => t.Truck)
            .Include(t => t.Route)
            .Include(t => t.TripStops)
                .ThenInclude(ts => ts.RouteStop)
            .Where(t => t.DriverId == driverId || (driverEmail != null && t.Driver != null && t.Driver.Email == driverEmail))
            .OrderByDescending(t => t.StartedAt)
            .FirstOrDefaultAsync();

        if (trip == null)
        {
            // Seed default active trip if none currently assigned to demo driver
            var defaultTruck = await _context.Trucks.FirstOrDefaultAsync(t => t.RegistrationNumber == "542-KM NC")
                               ?? await _context.Trucks.FirstOrDefaultAsync();
            var defaultRoute = await _context.Routes.Include(r => r.Stops).FirstOrDefaultAsync();

            if (defaultTruck != null && defaultRoute != null)
            {
                trip = new Trip
                {
                    TruckId = defaultTruck.Id,
                    DriverId = driverId ?? "drv-demo",
                    RouteId = defaultRoute.Id,
                    StartedAt = DateTime.UtcNow,
                    Status = "Active"
                };

                foreach (var stop in defaultRoute.Stops)
                {
                    trip.TripStops.Add(new TripStop
                    {
                        RouteStopId = stop.Id,
                        StopStatus = "Pending",
                        Completed = false
                    });
                }

                _context.Trips.Add(trip);
                await _context.SaveChangesAsync();

                await _context.Entry(trip).Reference(t => t.Truck).LoadAsync();
                await _context.Entry(trip).Reference(t => t.Route).LoadAsync();
                await _context.Entry(trip).Collection(t => t.TripStops).Query().Include(ts => ts.RouteStop).LoadAsync();
            }
        }

        if (trip == null) return NotFound(new { message = "No trip assigned for today." });

        var stops = trip.TripStops
            .OrderBy(ts => ts.RouteStop?.Sequence ?? 0)
            .Select(ts => new
            {
                ts.Id,
                ts.RouteStopId,
                StopName = ts.RouteStop?.Name ?? "Distribution Stop",
                Latitude = ts.RouteStop?.Latitude ?? -28.7183,
                Longitude = ts.RouteStop?.Longitude ?? 24.7319,
                Sequence = ts.RouteStop?.Sequence ?? 1,
                ts.StopStatus,
                ts.Completed,
                ts.ArrivedAt,
                ts.DeliveryStartedAt,
                ts.CompletedAt,
                ts.LitresDelivered,
                ts.DeliveryLocation,
                ts.Notes,
                EstimatedArrival = "8 mins (1.2 km)"
            }).ToList();

        var nextStop = stops.FirstOrDefault(s => !s.Completed);

        return Ok(new
        {
            TripId = trip.Id,
            Status = trip.Status,
            StartedAt = trip.StartedAt,
            EndedAt = trip.EndedAt,
            Vehicle = new
            {
                Registration = trip.Truck?.RegistrationNumber ?? "542-KM NC",
                CapacityLitres = trip.Truck?.CapacityLitres ?? 10000,
                Status = trip.Truck?.Status ?? "OnTrip"
            },
            Route = new
            {
                Id = trip.RouteId,
                Name = trip.Route?.Name ?? "Galeshewe Zone 3 Morning Route"
            },
            NextDestination = nextStop?.StopName ?? "All Delivery Stops Completed",
            NextStopEta = "12 mins",
            Stops = stops
        });
    }

    /// <summary>
    /// POST: api/v1/driver/trips/{id}/start-end
    /// Section 2.1.6: Start or End a trip
    /// </summary>
    [HttpPost("trips/{id:int}/status")]
    public async Task<IActionResult> ToggleTripStatus(int id, [FromBody] TripStatusUpdateDto dto)
    {
        var trip = await _context.Trips.Include(t => t.Truck).FirstOrDefaultAsync(t => t.Id == id);
        if (trip == null) return NotFound();

        trip.Status = dto.Status; // Active, Completed
        if (dto.Status == "Completed")
        {
            trip.EndedAt = DateTime.UtcNow;
            if (trip.Truck != null) trip.Truck.Status = "Available";
        }
        else if (dto.Status == "Active")
        {
            trip.StartedAt = DateTime.UtcNow;
            if (trip.Truck != null) trip.Truck.Status = "OnTrip";
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Trip status updated to {trip.Status}", tripId = trip.Id, status = trip.Status });
    }

    /// <summary>
    /// POST: api/v1/driver/trips/{id}/stops/{stopId}/arrive
    /// Section 2.1.7: Step 1 -> Arrived at stop
    /// </summary>
    [HttpPost("trips/{id:int}/stops/{stopId:int}/arrive")]
    public async Task<IActionResult> MarkStopArrived(int id, int stopId)
    {
        var stop = await _context.TripStops.Include(ts => ts.RouteStop).FirstOrDefaultAsync(ts => ts.TripId == id && ts.Id == stopId);
        if (stop == null) return NotFound();

        stop.StopStatus = "Arrived";
        stop.ArrivedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Arrived at {stop.RouteStop?.Name ?? "stop"}", stopStatus = "Arrived", arrivedAt = stop.ArrivedAt });
    }

    /// <summary>
    /// POST: api/v1/driver/trips/{id}/stops/{stopId}/start-delivery
    /// Section 2.1.7: Step 2 -> Start delivery at stop
    /// </summary>
    [HttpPost("trips/{id:int}/stops/{stopId:int}/start-delivery")]
    public async Task<IActionResult> StartStopDelivery(int id, int stopId)
    {
        var stop = await _context.TripStops.Include(ts => ts.RouteStop).FirstOrDefaultAsync(ts => ts.TripId == id && ts.Id == stopId);
        if (stop == null) return NotFound();

        stop.StopStatus = "Delivering";
        stop.DeliveryStartedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Water delivery started at {stop.RouteStop?.Name ?? "stop"}", stopStatus = "Delivering", startedAt = stop.DeliveryStartedAt });
    }

    /// <summary>
    /// POST: api/v1/driver/trips/{id}/stops/{stopId}/complete-delivery
    /// Section 2.1.7 & 2.1.8: Step 3 -> Delivery completed (records approx litres, location, time, optional notes)
    /// </summary>
    [HttpPost("trips/{id:int}/stops/{stopId:int}/complete-delivery")]
    public async Task<IActionResult> CompleteStopDelivery(int id, int stopId, [FromBody] CompleteDeliveryDto dto)
    {
        var stop = await _context.TripStops.Include(ts => ts.RouteStop).FirstOrDefaultAsync(ts => ts.TripId == id && ts.Id == stopId);
        if (stop == null) return NotFound();

        stop.StopStatus = "Completed";
        stop.Completed = true;
        stop.CompletedAt = DateTime.UtcNow;
        stop.LitresDelivered = dto.LitresDelivered ?? 2500;
        stop.DeliveryLocation = dto.DeliveryLocation ?? stop.RouteStop?.Name ?? "Distribution Point";
        stop.Notes = dto.Notes;

        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = $"Delivery completed at {stop.DeliveryLocation}",
            stopStatus = "Completed",
            completedAt = stop.CompletedAt,
            litresDelivered = stop.LitresDelivered,
            notes = stop.Notes
        });
    }

    /// <summary>
    /// POST: api/v1/driver/report-problem
    /// Section 2.2.1 & 2.2.2 & 2.3.3: Report problem with categories:
    /// Vehicle problem / Road-access problem / Water point problem / Unable to deliver / Other
    /// </summary>
    [HttpPost("report-problem")]
    public async Task<IActionResult> ReportProblem([FromBody] CreateDriverProblemDto dto)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "drv-demo";
        var driverName = User.FindFirstValue(ClaimTypes.Name) ?? "Sipho Dlamini";

        var problem = new DriverProblemReport
        {
            TripId = dto.TripId,
            StopId = dto.StopId,
            DriverId = driverId,
            DriverName = driverName,
            VehicleRegistration = dto.VehicleRegistration ?? "542-KM NC",
            Category = dto.Category ?? "Other",
            Description = dto.Description,
            Status = "Open",
            ReportedAt = DateTime.UtcNow
        };

        _context.DriverProblems.Add(problem);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Problem reported successfully to Sol Plaatje Municipal Operations Desk.", problemId = problem.Id });
    }

    /// <summary>
    /// POST: api/v1/driver/vehicle-check
    /// Section 2.3.2: Perform a pre-trip vehicle check
    /// </summary>
    [HttpPost("vehicle-check")]
    public async Task<IActionResult> PerformVehicleCheck([FromBody] CreateVehicleCheckDto dto)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "drv-demo";
        var driverName = User.FindFirstValue(ClaimTypes.Name) ?? "Sipho Dlamini";

        bool allPass = dto.BrakesOk && dto.TiresOk && dto.WaterSealOk && dto.LightsOk;
        string overall = allPass ? "Pass" : "PassWithWarnings";

        var check = new VehicleInspectionCheck
        {
            DriverId = driverId,
            DriverName = driverName,
            VehicleRegistration = dto.VehicleRegistration ?? "542-KM NC",
            BrakesOk = dto.BrakesOk,
            TiresOk = dto.TiresOk,
            WaterSealOk = dto.WaterSealOk,
            LightsOk = dto.LightsOk,
            OverallStatus = overall,
            Remarks = dto.Remarks,
            InspectedAt = DateTime.UtcNow
        };

        _context.VehicleInspectionChecks.Add(check);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Pre-trip vehicle inspection recorded.", status = overall, checkId = check.Id });
    }

    /// <summary>
    /// GET: api/v1/driver/activity
    /// Section 2.5: Driver Activity (Completed trips, previous deliveries, reported problems, trip history)
    /// </summary>
    [HttpGet("activity")]
    public async Task<IActionResult> GetDriverActivity()
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var completedTrips = await _context.Trips
            .Include(t => t.Truck)
            .Include(t => t.Route)
            .Include(t => t.TripStops)
            .Where(t => t.Status == "Completed")
            .OrderByDescending(t => t.EndedAt)
            .Take(10)
            .AsNoTracking()
            .ToListAsync();

        var reportedProblems = await _context.DriverProblems
            .OrderByDescending(p => p.ReportedAt)
            .Take(10)
            .AsNoTracking()
            .ToListAsync();

        return Ok(new
        {
            TotalCompletedTrips = completedTrips.Count,
            TotalLitresDelivered = completedTrips.Sum(t => t.TripStops.Where(s => s.Completed).Sum(s => s.LitresDelivered ?? 2500)),
            CompletedTrips = completedTrips.Select(t => new
            {
                t.Id,
                RouteName = t.Route?.Name ?? "Delivery Route",
                VehicleRegistration = t.Truck?.RegistrationNumber ?? "542-KM NC",
                t.StartedAt,
                t.EndedAt,
                StopsCompleted = t.TripStops.Count(s => s.Completed)
            }),
            ReportedProblems = reportedProblems
        });
    }

    /// <summary>
    /// GET: api/v1/driver/notifications
    /// Section 2.4: Driver Notifications (New trip assignments, trip changes, admin messages, incident notifications)
    /// </summary>
    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications()
    {
        var notifications = await _context.NotificationLogs
            .OrderByDescending(n => n.SentAt)
            .Take(15)
            .AsNoTracking()
            .ToListAsync();

        return Ok(notifications);
    }
}

public class TripStatusUpdateDto { public string Status { get; set; } = "Active"; }
public class CompleteDeliveryDto { public double? LitresDelivered { get; set; } public string? DeliveryLocation { get; set; } public string? Notes { get; set; } }
public class CreateDriverProblemDto { public int? TripId { get; set; } public int? StopId { get; set; } public string? VehicleRegistration { get; set; } public string Category { get; set; } = "Vehicle problem"; public string Description { get; set; } = string.Empty; }
public class CreateVehicleCheckDto { public string? VehicleRegistration { get; set; } public bool BrakesOk { get; set; } = true; public bool TiresOk { get; set; } = true; public bool WaterSealOk { get; set; } = true; public bool LightsOk { get; set; } = true; public string? Remarks { get; set; } }
