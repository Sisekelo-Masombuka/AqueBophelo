using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Reports;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET: api/v1/reports/summary
    /// Aggregates high-level operational analytics across fleet, distribution trips, water reservoirs and alerts.
    /// Provides data for the Sol Plaatje Municipal Admin Command Center.
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<FleetReportSummaryDto>> GetSummary()
    {
        // 1. Water Tanker Fleet Metrics
        var totalTrucks = await _context.Trucks.CountAsync();
        var availableTrucks = await _context.Trucks.CountAsync(t => t.Status == "Available");
        var onTripTrucks = await _context.Trucks.CountAsync(t => t.Status == "OnTrip" || t.Status == "Active");
        var maintenanceTrucks = await _context.Trucks.CountAsync(t => t.Status == "Maintenance");
        var totalCapacity = await _context.Trucks.SumAsync(t => (double?)t.CapacityLitres) ?? 0.0;

        // 2. Trip & Distribution Metrics
        var totalTrips = await _context.Trips.CountAsync();
        var activeTrips = await _context.Trips.CountAsync(t => t.Status == "Active");
        var completedTrips = await _context.Trips.CountAsync(t => t.Status == "Completed");
        var totalStopsCompleted = await _context.TripStops.CountAsync(ts => ts.Completed);

        var totalLitresDelivered = await _context.Trips
            .Where(t => t.Status == "Completed")
            .Include(t => t.Truck)
            .SumAsync(t => t.Truck != null ? (double?)t.Truck.CapacityLitres : 0.0) ?? 0.0;

        // 3. Dams & Municipal Reservoirs
        var dams = await _context.Dams
            .Include(d => d.Readings)
            .AsNoTracking()
            .ToListAsync();

        var damSummaries = new List<DamSummaryDto>();
        var totalDamLevels = 0.0;
        var criticalDamsCount = 0;

        foreach (var dam in dams)
        {
            var latestReading = dam.Readings.OrderByDescending(r => r.RecordedAt).FirstOrDefault();
            var levelPercent = latestReading?.LevelPercent ?? 0.0;

            string statusBand;
            string statusColor;

            if (levelPercent < 15.0)
            {
                statusBand = "Critical";
                statusColor = "Red";
                criticalDamsCount++;
            }
            else if (levelPercent < 30.0)
            {
                statusBand = "Low";
                statusColor = "Red";
                criticalDamsCount++;
            }
            else if (levelPercent < 50.0)
            {
                statusBand = "Watch";
                statusColor = "Amber";
            }
            else
            {
                statusBand = "Healthy";
                statusColor = "Green";
            }

            totalDamLevels += levelPercent;

            damSummaries.Add(new DamSummaryDto
            {
                DamId = dam.Id,
                DamName = dam.Name,
                CapacityMegaLitres = dam.CapacityMegaLitres,
                LatestLevelPercent = Math.Round(levelPercent, 1),
                StatusBand = statusBand,
                StatusColor = statusColor
            });
        }

        var averageDamLevel = dams.Count > 0 ? Math.Round(totalDamLevels / dams.Count, 1) : 0.0;

        // 4. Alerts & Municipal Areas
        var activeAlertsCount = await _context.Alerts.CountAsync(a => a.Severity == "Critical" || a.Severity == "Warning");
        var totalAreas = await _context.Areas.CountAsync();

        // 5. Area Breakdown
        var areas = await _context.Areas
            .Include(a => a.Routes)
            .AsNoTracking()
            .ToListAsync();

        var activeTripRouteIds = await _context.Trips
            .Where(t => t.Status == "Active")
            .Select(t => t.RouteId)
            .ToListAsync();

        var areaSummaries = areas.Select(a => new AreaSummaryDto
        {
            AreaId = a.Id,
            AreaName = a.Name,
            RoutesCount = a.Routes.Count,
            ActiveTripsCount = a.Routes.Count(r => activeTripRouteIds.Contains(r.Id))
        }).ToList();

        var report = new FleetReportSummaryDto
        {
            TotalTrucks = totalTrucks,
            AvailableTrucks = availableTrucks,
            OnTripTrucks = onTripTrucks,
            MaintenanceTrucks = maintenanceTrucks,
            TotalFleetCapacityLitres = totalCapacity,

            TotalTrips = totalTrips,
            ActiveTrips = activeTrips,
            CompletedTrips = completedTrips,
            TotalStopsCompleted = totalStopsCompleted,
            TotalLitresDelivered = totalLitresDelivered,

            TotalDams = dams.Count,
            AverageDamLevelPercent = averageDamLevel,
            CriticalDamsCount = criticalDamsCount,
            ActiveAlertsCount = activeAlertsCount,
            TotalMunicipalAreas = totalAreas,

            AreasSummary = areaSummaries,
            DamsSummary = damSummaries
        };

        return Ok(report);
    }
}
