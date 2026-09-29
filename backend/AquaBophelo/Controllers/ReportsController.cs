using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Reports;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public ReportsController(AppDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    /// <summary>
    /// GET: api/v1/reports/summary
    /// Aggregates high-level operational analytics across fleet, distribution trips, water reservoirs and alerts.
    /// Provides data for the Sol Plaatje Municipal Admin Command Center.
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<FleetReportSummaryDto>> GetSummary()
    {
        var totalTrucks = await _context.Trucks.CountAsync();
        var availableTrucks = await _context.Trucks.CountAsync(t => t.Status == "Available");
        var onTripTrucks = await _context.Trucks.CountAsync(t => t.Status == "OnTrip" || t.Status == "Active");
        var maintenanceTrucks = await _context.Trucks.CountAsync(t => t.Status == "Maintenance");
        var totalCapacity = await _context.Trucks.SumAsync(t => (double?)t.CapacityLitres) ?? 0.0;

        var totalTrips = await _context.Trips.CountAsync();
        var activeTrips = await _context.Trips.CountAsync(t => t.Status == "Active");
        var completedTrips = await _context.Trips.CountAsync(t => t.Status == "Completed");
        var totalStopsCompleted = await _context.TripStops.CountAsync(ts => ts.Completed);

        var totalLitresDelivered = await _context.Trips
            .Where(t => t.Status == "Completed")
            .Include(t => t.Truck)
            .SumAsync(t => t.Truck != null ? (double?)t.Truck.CapacityLitres : 0.0) ?? 0.0;

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
        var activeAlertsCount = await _context.Alerts.CountAsync(a => a.Severity == "Critical" || a.Severity == "Warning");
        var totalAreas = await _context.Areas.CountAsync();

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

    /// <summary>
    /// POST: api/v1/reports/issues
    /// Allows a resident to submit a fault report with an optional photo upload.
    /// </summary>
    [HttpPost("issues")]
    [AllowAnonymous]
    public async Task<ActionResult<IssueReport>> CreateIssueReport([FromBody] CreateIssueReportDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email) ?? dto.UserEmail ?? "resident@solplaatje.gov.za";
        var name = User.FindFirstValue(ClaimTypes.Name) ?? dto.FullName ?? "Kimberley Resident";

        var ticketId = $"#SPM-2026-{Random.Shared.Next(1000, 9999)}";

        var issue = new IssueReport
        {
            TicketId = ticketId,
            UserId = userId,
            UserEmail = email,
            FullName = name,
            IssueType = dto.IssueType ?? "General Water Issue",
            Area = dto.Area ?? "Galeshewe",
            StreetAddress = dto.StreetAddress ?? "Central District",
            Description = dto.Description ?? "Water fault reported",
            ImageUrl = dto.ImageUrl ?? "/pipe_leak.jpg",
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.IssueReports.Add(issue);

        // Also log notification for user
        _context.NotificationLogs.Add(new NotificationLog
        {
            UserId = userId ?? "anonymous",
            Title = $"Fault Logged: {ticketId}",
            Message = $"Your report for '{issue.IssueType}' in {issue.Area} has been submitted to Sol Plaatje Municipal Dispatch.",
            Type = "ReportUpdate",
            IsRead = false,
            SentAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        // Send confirmation email
        if (!string.IsNullOrEmpty(email))
        {
            await _notificationService.SendEmailAsync(
                email,
                $"Sol Plaatje Water Fault Receipt [{ticketId}]",
                $"<div style='font-family:sans-serif;'><h2>Fault Ticket Received</h2><p>Thank you <strong>{name}</strong> for reporting this issue.</p><p><strong>Ticket ID:</strong> {ticketId}</p><p><strong>Type:</strong> {issue.IssueType}</p><p><strong>Area:</strong> {issue.Area}</p><p><strong>Status:</strong> Pending Dispatch Review</p><hr/><p><em>Sol Plaatje Municipality Engineering Dept</em></p></div>"
            );
        }

        return CreatedAtAction(nameof(GetMyIssues), new { id = issue.Id }, issue);
    }

    /// <summary>
    /// GET: api/v1/reports/issues/my
    /// Gets submitted issue reports for the current resident.
    /// </summary>
    [HttpGet("issues/my")]
    public async Task<ActionResult<IEnumerable<IssueReport>>> GetMyIssues()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);

        var issues = await _context.IssueReports
            .Where(i => (userId != null && i.UserId == userId) || (email != null && i.UserEmail == email))
            .OrderByDescending(i => i.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

        return Ok(issues);
    }

    /// <summary>
    /// GET: api/v1/reports/issues
    /// Admin gets all submitted fault reports.
    /// </summary>
    [HttpGet("issues")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<IssueReport>>> GetAllIssues()
    {
        var issues = await _context.IssueReports
            .OrderByDescending(i => i.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

        return Ok(issues);
    }

    /// <summary>
    /// PATCH: api/v1/reports/issues/{id}/status
    /// Admin updates the status of a submitted issue (e.g. Pending -> In Progress -> Resolved).
    /// </summary>
    [HttpPatch("issues/{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateIssueStatus(int id, [FromBody] UpdateIssueStatusDto dto)
    {
        var issue = await _context.IssueReports.FindAsync(id);
        if (issue == null) return NotFound();

        issue.Status = dto.Status;
        issue.AdminNotes = dto.AdminNotes;
        issue.UpdatedAt = DateTime.UtcNow;

        // Log notification for the resident
        if (!string.IsNullOrEmpty(issue.UserId))
        {
            _context.NotificationLogs.Add(new NotificationLog
            {
                UserId = issue.UserId,
                Title = $"Issue Update [{issue.TicketId}]: {issue.Status}",
                Message = $"Your reported water issue in {issue.Area} status has been updated to '{issue.Status}'. Notes: {dto.AdminNotes}",
                Type = "ReportUpdate",
                IsRead = false,
                SentAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

        // Send email update to resident
        if (!string.IsNullOrEmpty(issue.UserEmail))
        {
            await _notificationService.SendEmailAsync(
                issue.UserEmail,
                $"Status Update for Fault Ticket [{issue.TicketId}]",
                $"<div style='font-family:sans-serif;'><h2>Issue Status Updated: {issue.Status}</h2><p>Dear <strong>{issue.FullName}</strong>,</p><p>The status of your ticket <strong>{issue.TicketId}</strong> ({issue.IssueType}) in {issue.Area} has been updated to: <strong style='color:#152e52;'>{issue.Status}</strong>.</p><p><strong>Admin Remarks:</strong> {dto.AdminNotes ?? "Engineers dispatched to location."}</p><hr/><p><em>Sol Plaatje Municipality Water Department</em></p></div>"
            );
        }

        return Ok(issue);
    }
}

public class CreateIssueReportDto
{
    public string? IssueType { get; set; }
    public string? Area { get; set; }
    public string? StreetAddress { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? UserEmail { get; set; }
    public string? FullName { get; set; }
}

public class UpdateIssueStatusDto
{
    public string Status { get; set; } = "In Progress"; // Pending, In Progress, Resolved, Rejected
    public string? AdminNotes { get; set; }
}
