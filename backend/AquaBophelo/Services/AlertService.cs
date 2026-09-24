using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Alerts;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services;

public class AlertService : IAlertService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public AlertService(AppDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<IEnumerable<AlertResponseDto>> GetAlertsAsync(int? areaId = null, string? type = null)
    {
        var query = _context.Alerts
            .Include(a => a.Dam)
            .Include(a => a.Area)
            .Include(a => a.CreatedByUser)
            .AsQueryable();

        if (areaId.HasValue)
        {
            query = query.Where(a => a.AreaId == areaId.Value || a.AreaId == null);
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            query = query.Where(a => a.Type.Equals(type, StringComparison.OrdinalIgnoreCase));
        }

        var alerts = await query.OrderByDescending(a => a.CreatedAt).ToListAsync();
        return alerts.Select(MapToAlertResponseDto);
    }

    public async Task<AlertResponseDto?> GetAlertByIdAsync(int id)
    {
        var alert = await _context.Alerts
            .Include(a => a.Dam)
            .Include(a => a.Area)
            .Include(a => a.CreatedByUser)
            .FirstOrDefaultAsync(a => a.Id == id);

        return alert == null ? null : MapToAlertResponseDto(alert);
    }

    public async Task<AlertResponseDto> CreateAlertAsync(CreateAlertDto dto, string? createdByUserId = null)
    {
        var alert = new Alert
        {
            Type = dto.Type,
            Severity = dto.Severity,
            Title = dto.Title,
            Message = dto.Message,
            DamId = dto.DamId,
            AreaId = dto.AreaId,
            CreatedAt = DateTime.UtcNow,
            CreatedByUserId = createdByUserId
        };

        _context.Alerts.Add(alert);
        await _context.SaveChangesAsync();

        // Auto-dispatch notification emails/SMS to subscribed residents
        await _notificationService.DispatchAlertNotificationsAsync(alert);

        // Reload navigation properties for clean response DTO
        await _context.Entry(alert).Reference(a => a.Dam).LoadAsync();
        await _context.Entry(alert).Reference(a => a.Area).LoadAsync();
        if (createdByUserId != null)
        {
            await _context.Entry(alert).Reference(a => a.CreatedByUser).LoadAsync();
        }

        return MapToAlertResponseDto(alert);
    }

    private static AlertResponseDto MapToAlertResponseDto(Alert alert)
    {
        return new AlertResponseDto
        {
            Id = alert.Id,
            Type = alert.Type,
            Severity = alert.Severity,
            Title = alert.Title,
            Message = alert.Message,
            DamId = alert.DamId,
            DamName = alert.Dam?.Name,
            AreaId = alert.AreaId,
            AreaName = alert.Area?.Name,
            CreatedAt = alert.CreatedAt,
            CreatedAtSast = FormatSast(alert.CreatedAt),
            CreatedByUserId = alert.CreatedByUserId,
            CreatedByName = alert.CreatedByUser?.FullName
        };
    }

    private static string FormatSast(DateTime utcTime)
    {
        var sastTime = utcTime.AddHours(2);
        return sastTime.ToString("yyyy-MM-dd HH:mm SAST");
    }
}
