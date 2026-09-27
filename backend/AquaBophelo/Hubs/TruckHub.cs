using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Models;

namespace AquaBophelo.Hubs;

public class TruckHub : Hub
{
    private readonly AppDbContext _context;
    private readonly ILogger<TruckHub> _logger;

    public TruckHub(AppDbContext context, ILogger<TruckHub> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Subscribe to real-time updates for a specific truck
    /// </summary>
    public async Task JoinTruckGroup(int truckId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"truck-{truckId}");
        _logger.LogInformation("Connection {ConnectionId} joined truck-{TruckId}", Context.ConnectionId, truckId);
    }

    /// <summary>
    /// Unsubscribe from a truck's updates
    /// </summary>
    public async Task LeaveTruckGroup(int truckId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"truck-{truckId}");
    }

    /// <summary>
    /// Subscribe to real-time updates for all trucks in a municipal area (e.g. Galeshewe)
    /// </summary>
    public async Task JoinAreaGroup(int areaId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"area-{areaId}");
        _logger.LogInformation("Connection {ConnectionId} joined area-{AreaId}", Context.ConnectionId, areaId);
    }

    /// <summary>
    /// Unsubscribe from an area's updates
    /// </summary>
    public async Task LeaveAreaGroup(int areaId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"area-{areaId}");
    }

    /// <summary>
    /// Called by driver device/phone to broadcast live GPS coordinates.
    /// Secured: Requires authenticated Driver or Admin role, and verifies driver assignment.
    /// </summary>
    [Authorize(Roles = "Driver,Admin")]
    public async Task SendLocation(int tripId, double latitude, double longitude, double? speedKmh = null, double? heading = null)
    {
        var trip = await _context.Trips
            .Include(t => t.Truck)
            .Include(t => t.Route)
            .FirstOrDefaultAsync(t => t.Id == tripId);

        if (trip == null || trip.Status != "Active" || trip.Truck == null)
        {
            _logger.LogWarning("Location rejected: Trip {TripId} is not active or truck missing.", tripId);
            return;
        }

        // Validate incoming GPS data boundaries (latitude -90..90, longitude -180..180, speed >= 0)
        if (latitude < -90.0 || latitude > 90.0 || longitude < -180.0 || longitude > 180.0)
        {
            _logger.LogWarning("Location rejected: Invalid GPS coordinates ({Lat}, {Lng}) for Trip {TripId}", latitude, longitude, tripId);
            return;
        }

        if (speedKmh.HasValue && (speedKmh.Value < 0.0 || speedKmh.Value > 250.0))
        {
            _logger.LogWarning("Location rejected: Out-of-range speed ({Speed} km/h) for Trip {TripId}", speedKmh.Value, tripId);
            return;
        }

        // Verify that the caller is either the assigned driver for this trip/truck or an Admin
        var callingUserId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = Context.User?.IsInRole("Admin") ?? false;
        var assignedDriverId = trip.DriverId ?? trip.Truck.DriverId;

        if (!isAdmin && (string.IsNullOrEmpty(callingUserId) || callingUserId != assignedDriverId))
        {
            _logger.LogWarning(
                "Unauthorized location update attempt for Trip {TripId} by caller {CallingUser}. Assigned driver is {AssignedDriver}.",
                tripId,
                callingUserId ?? "Anonymous",
                assignedDriverId ?? "None"
            );
            return; // Gracefully reject without breaking the WebSocket connection
        }

        var now = DateTime.UtcNow;

        // 1. Update latest position on the Truck record (fast lookup for map markers)
        trip.Truck.LastLatitude = latitude;
        trip.Truck.LastLongitude = longitude;
        trip.Truck.LastSeenAt = now;

        // 2. Persist historical breadcrumb in TruckLocations
        var location = new TruckLocation
        {
            TruckId = trip.TruckId,
            TripId = trip.Id,
            Latitude = latitude,
            Longitude = longitude,
            SpeedKmh = speedKmh,
            Heading = heading,
            RecordedAt = now
        };

        _context.TruckLocations.Add(location);
        await _context.SaveChangesAsync();

        // 3. Construct live payload with Central Africa Time (CAT)
        var payload = new
        {
            truckId = trip.TruckId,
            tripId = trip.Id,
            registrationNumber = trip.Truck.RegistrationNumber,
            status = trip.Truck.Status,
            latitude = latitude,
            longitude = longitude,
            speedKmh = speedKmh,
            heading = heading,
            recordedAt = now,
            recordedAtFormatted = now.AddHours(2).ToString("dd MMM yyyy, hh:mm:ss tt") + " (CAT)"
        };

        // 4. Broadcast live to everyone watching this truck, area, and the global map
        await Clients.Group($"truck-{trip.TruckId}").SendAsync("LocationUpdated", payload);

        if (trip.Route?.AreaId.HasValue == true)
        {
            await Clients.Group($"area-{trip.Route.AreaId.Value}").SendAsync("LocationUpdated", payload);
        }

        // Broadcast to all map viewers (e.g. LiveMap.jsx)
        await Clients.All.SendAsync("LocationUpdated", payload);

        _logger.LogInformation("GPS updated for Truck {Registration}: {Lat}, {Lng} at {Time}", 
            trip.Truck.RegistrationNumber, latitude, longitude, payload.recordedAtFormatted);
    }
}
