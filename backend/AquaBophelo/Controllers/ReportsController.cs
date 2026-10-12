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
    private readonly IAuditLogger _auditLogger;

    public ReportsController(AppDbContext context, INotificationService notificationService, IAuditLogger auditLogger)
    {
        _context = context;
        _notificationService = notificationService;
        _auditLogger = auditLogger;
    }

    /// <summary>
    /// GET: api/v1/reports/summary
    /// Aggregates high-level operational analytics across fleet, distribution trips, water reservoirs and alerts.
    /// Provides data for the Sol Plaatje Municipal Admin Command Center.
    /// </summary>
    [HttpGet("summary")]
    [AllowAnonymous]
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
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var rawEmail = User.FindFirstValue(ClaimTypes.Email);
        var rawName = User.FindFirstValue(ClaimTypes.Name);

        bool isAnonymous = dto.IsAnonymous || string.IsNullOrEmpty(rawUserId);

        string? reportUserId = isAnonymous ? null : rawUserId;
        string email = isAnonymous
            ? (!string.IsNullOrWhiteSpace(dto.UserEmail) && dto.UserEmail.Contains("@") ? dto.UserEmail : "anonymous@solplaatje.gov.za")
            : (rawEmail ?? dto.UserEmail ?? "resident@solplaatje.gov.za");
        string name = isAnonymous
            ? "Anonymous Resident"
            : (rawName ?? dto.FullName ?? "Kimberley Resident");

        var ticketId = $"#SPM-2026-{Random.Shared.Next(1000, 9999)}";

        var issue = new IssueReport
        {
            TicketId = ticketId,
            UserId = reportUserId,
            UserEmail = email,
            FullName = name,
            IssueType = dto.IssueType ?? "General Water Issue",
            Area = dto.Area ?? "Galeshewe",
            StreetAddress = dto.StreetAddress ?? "Central District",
            Description = dto.Description ?? "Water fault reported",
            ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) || dto.ImageUrl == "/pipe_leak.jpg" ? null : dto.ImageUrl,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.IssueReports.Add(issue);

        // Only log InApp notification for authenticated non-anonymous users to avoid FK violation!
        if (!string.IsNullOrEmpty(reportUserId))
        {
            _context.NotificationLogs.Add(new NotificationLog
            {
                UserId = reportUserId,
                Title = $"Fault Logged: {ticketId}",
                Message = $"Your report for '{issue.IssueType}' in {issue.Area} has been submitted to Sol Plaatje Municipal Dispatch.",
                Type = "ReportUpdate",
                IsRead = false,
                SentAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

        await _auditLogger.LogAsync(
            action: "ISSUE_REPORT_CREATED",
            category: "Reports",
            details: $"Fault ticket '{ticketId}' created for '{issue.IssueType}' at '{issue.StreetAddress}, {issue.Area}'. Anonymous: {isAnonymous}. Photo URL: {issue.ImageUrl ?? "None"}",
            userId: reportUserId,
            userEmail: email,
            entityName: "IssueReport",
            entityId: issue.Id.ToString()
        );

        // Send confirmation email only if valid non-anonymous recipient email is provided
        if (!string.IsNullOrEmpty(email) && !email.Equals("anonymous@solplaatje.gov.za", StringComparison.OrdinalIgnoreCase) && email.Contains("@"))
        {
            try
            {
                string receiptHtml = $@"<div style=""font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;"">
  <div style=""background: #152e52; padding: 22px 26px; text-align: left;"">
    <div style=""color: #38bdf8; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;"">Sol Plaatje Municipality • Water Operations</div>
    <h1 style=""color: #ffffff; font-size: 20px; margin: 6px 0 0; font-family: serif;"">Water Fault Report Received</h1>
  </div>
  <div style=""padding: 24px; color: #334155; line-height: 1.6; font-size: 14px;"">
    <p style=""margin-top: 0;"">Hello <strong>{name}</strong>,</p>
    <p>Thank you for notifying Sol Plaatje Municipal Water Dispatch. Your fault report has been logged and assigned to engineering field dispatch.</p>
    <div style=""background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 18px 0;"">
      <div style=""margin-bottom: 8px;""><span style=""color: #64748b; font-size: 12px;"">Ticket ID:</span> <strong style=""color: #152e52; font-family: monospace; font-size: 14px;"">{ticketId}</strong></div>
      <div style=""margin-bottom: 8px;""><span style=""color: #64748b; font-size: 12px;"">Category:</span> <strong style=""color: #0f172a;"">{issue.IssueType}</strong></div>
      <div style=""margin-bottom: 8px;""><span style=""color: #64748b; font-size: 12px;"">Location:</span> <strong style=""color: #0f172a;"">{issue.StreetAddress}, {issue.Area}</strong></div>
      <div><span style=""color: #64748b; font-size: 12px;"">Status:</span> <span style=""background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;"">Pending Dispatch Review</span></div>
    </div>
    <p style=""font-size: 12px; color: #64748b;"">You will receive an update once municipal technicians are assigned or when repairs commence.</p>
    <hr style=""border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"" />
    <p style=""font-size: 11px; color: #94a3b8; margin-bottom: 0; text-align: center;"">
      Elke druppel tel • Metsi ke bophelo<br/>
      Sol Plaatje Local Municipality • Northern Cape, South Africa
    </p>
  </div>
</div>";

                await _notificationService.SendEmailAsync(
                    email,
                    $"Sol Plaatje Water Fault Receipt [{ticketId}]",
                    receiptHtml
                );
            }
            catch (Exception emailEx)
            {
                System.Diagnostics.Debug.WriteLine($"Confirmation email notice: {emailEx.Message}");
            }
        }

        return Ok(issue);
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

        // Send email update to resident (skip dummy anonymous addresses)
        if (!string.IsNullOrEmpty(issue.UserEmail) &&
            !issue.UserEmail.Equals("anonymous@solplaatje.gov.za", StringComparison.OrdinalIgnoreCase) &&
            issue.UserEmail.Contains("@"))
        {
            try
            {
                string statusHtml = $@"<div style=""font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;"">
  <div style=""background: #152e52; padding: 22px 26px; text-align: left;"">
    <div style=""color: #38bdf8; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;"">Sol Plaatje Municipality • Water Operations</div>
    <h1 style=""color: #ffffff; font-size: 20px; margin: 6px 0 0; font-family: serif;"">Fault Ticket Status Update</h1>
  </div>
  <div style=""padding: 24px; color: #334155; line-height: 1.6; font-size: 14px;"">
    <p style=""margin-top: 0;"">Hello <strong>{issue.FullName}</strong>,</p>
    <p>The operational status of your water fault report has been updated by Sol Plaatje Municipal Water Dispatch.</p>
    <div style=""background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 18px 0;"">
      <div style=""margin-bottom: 8px;""><span style=""color: #64748b; font-size: 12px;"">Ticket ID:</span> <strong style=""color: #152e52; font-family: monospace; font-size: 14px;"">{issue.TicketId}</strong></div>
      <div style=""margin-bottom: 8px;""><span style=""color: #64748b; font-size: 12px;"">Category:</span> <strong style=""color: #0f172a;"">{issue.IssueType}</strong></div>
      <div style=""margin-bottom: 8px;""><span style=""color: #64748b; font-size: 12px;"">Location:</span> <strong style=""color: #0f172a;"">{issue.StreetAddress}, {issue.Area}</strong></div>
      <div style=""margin-bottom: 8px;""><span style=""color: #64748b; font-size: 12px;"">New Status:</span> <span style=""background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px;"">{issue.Status}</span></div>
      <div><span style=""color: #64748b; font-size: 12px;"">Dispatch Remarks:</span> <strong style=""color: #334155;"">{dto.AdminNotes ?? "Municipal engineering team dispatched to site."}</strong></div>
    </div>
    <p style=""font-size: 12px; color: #64748b;"">If you have further inquiries regarding this fault, refer to ticket reference <strong>{issue.TicketId}</strong>.</p>
    <hr style=""border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"" />
    <p style=""font-size: 11px; color: #94a3b8; margin-bottom: 0; text-align: center;"">
      Elke druppel tel • Metsi ke bophelo<br/>
      Sol Plaatje Local Municipality • Northern Cape, South Africa
    </p>
  </div>
</div>";

                await _notificationService.SendEmailAsync(
                    issue.UserEmail,
                    $"Sol Plaatje Water Ticket Update [{issue.TicketId}] - {issue.Status}",
                    statusHtml
                );
            }
            catch (Exception emailEx)
            {
                System.Diagnostics.Debug.WriteLine($"Status update email notice: {emailEx.Message}");
            }
        }

        return Ok(issue);
    }

    /// <summary>
    /// POST: api/v1/reports/presigned-url
    /// Generates a Cloudflare R2 presigned PUT URL for direct photo uploads from the React SPA.
    /// </summary>
    [HttpPost("presigned-url")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPresignedUploadUrl(
        [FromServices] IR2StorageService r2Service,
        [FromBody] PresignedUrlRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FileName) || string.IsNullOrWhiteSpace(dto.ContentType))
        {
            return BadRequest(new { message = "FileName and ContentType are required." });
        }

        try
        {
            var (presignedUrl, fileUrl, objectKey) = await r2Service.GetPresignedUploadUrlAsync(dto.FileName, dto.ContentType);
            return Ok(new
            {
                presignedUrl,
                fileUrl,
                objectKey,
                message = "Presigned R2 upload URL generated successfully."
            });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// POST: api/v1/reports/upload-photo
    /// Directly streams and uploads photo to Cloudflare R2 from backend to avoid browser CORS issues.
    /// </summary>
    [HttpPost("upload-photo")]
    [AllowAnonymous]
    public async Task<IActionResult> UploadPhoto(
        [FromServices] IR2StorageService r2Service,
        IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No image file provided." });
        }

        try
        {
            using var stream = file.OpenReadStream();
            var (fileUrl, objectKey) = await r2Service.UploadFileAsync(stream, file.FileName, file.ContentType);
            return Ok(new
            {
                fileUrl,
                objectKey,
                message = "Photo uploaded successfully to Cloudflare R2 bucket."
            });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Cloudflare R2 storage error: {ex.Message}" });
        }
    }
}

public class PresignedUrlRequestDto
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
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
    public bool IsAnonymous { get; set; } = false;
}

public class UpdateIssueStatusDto
{
    public string Status { get; set; } = "In Progress"; // Pending, In Progress, Resolved, Rejected
    public string? AdminNotes { get; set; }
}
