using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Dams;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services;

public class DamService : IDamService
{
    private readonly AppDbContext _context;
    private readonly IAlertEvaluator _alertEvaluator;

    public DamService(AppDbContext context, IAlertEvaluator alertEvaluator)
    {
        _context = context;
        _alertEvaluator = alertEvaluator;
    }

    public async Task<IEnumerable<DamResponseDto>> GetAllDamsAsync()
    {
        var dams = await _context.Dams
            .Include(d => d.Area)
            .Include(d => d.Readings.OrderByDescending(r => r.RecordedAt))
            .ToListAsync();

        return dams.Select(MapToDamResponseDto);
    }

    public async Task<DamResponseDto?> GetDamByIdAsync(int id)
    {
        var dam = await _context.Dams
            .Include(d => d.Area)
            .Include(d => d.Readings.OrderByDescending(r => r.RecordedAt))
            .FirstOrDefaultAsync(d => d.Id == id);

        return dam == null ? null : MapToDamResponseDto(dam);
    }

    public async Task<DamResponseDto> CreateDamAsync(CreateDamDto dto)
    {
        var dam = new Dam
        {
            Name = dto.Name,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            CapacityMegaLitres = dto.CapacityMegaLitres,
            IsActive = true,
            AreaId = dto.AreaId
        };

        _context.Dams.Add(dam);
        await _context.SaveChangesAsync();

        return MapToDamResponseDto(dam);
    }

    public async Task<DamResponseDto?> UpdateDamAsync(int id, UpdateDamDto dto)
    {
        var dam = await _context.Dams
            .Include(d => d.Area)
            .Include(d => d.Readings.OrderByDescending(r => r.RecordedAt))
            .FirstOrDefaultAsync(d => d.Id == id);

        if (dam == null) return null;

        dam.Name = dto.Name;
        dam.Latitude = dto.Latitude;
        dam.Longitude = dto.Longitude;
        dam.CapacityMegaLitres = dto.CapacityMegaLitres;
        dam.IsActive = dto.IsActive;
        dam.AreaId = dto.AreaId;

        await _context.SaveChangesAsync();
        return MapToDamResponseDto(dam);
    }

    public async Task<bool> DeleteDamAsync(int id)
    {
        var dam = await _context.Dams.FindAsync(id);
        if (dam == null) return false;

        _context.Dams.Remove(dam);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<DamReadingResponseDto>> GetDamReadingsAsync(int damId, int days = 30)
    {
        var cutoff = DateTime.UtcNow.AddDays(-days);

        var readings = await _context.DamReadings
            .Include(r => r.Dam)
            .Where(r => r.DamId == damId && r.RecordedAt >= cutoff)
            .OrderBy(r => r.RecordedAt)
            .ToListAsync();

        return readings.Select(MapToReadingResponseDto);
    }

    public async Task<DamReadingResponseDto> AddDamReadingAsync(int damId, CreateDamReadingDto dto)
    {
        var dam = await _context.Dams.FindAsync(damId);
        if (dam == null)
        {
            throw new KeyNotFoundException($"Dam with ID {damId} not found.");
        }

        var volume = dto.VolumeMegaLitres ?? (dam.CapacityMegaLitres * (dto.LevelPercent / 100.0));

        var reading = new DamReading
        {
            DamId = damId,
            LevelPercent = Math.Round(dto.LevelPercent, 2),
            VolumeMegaLitres = Math.Round(volume, 2),
            RecordedAt = DateTime.UtcNow,
            Source = dto.Source
        };

        _context.DamReadings.Add(reading);
        await _context.SaveChangesAsync();

        // Evaluate dam level thresholds for auto alerts
        await _alertEvaluator.EvaluateDamReadingAsync(reading, dam);

        return MapToReadingResponseDto(reading);
    }

    private static DamResponseDto MapToDamResponseDto(Dam dam)
    {
        var latestReading = dam.Readings.OrderByDescending(r => r.RecordedAt).FirstOrDefault();
        double? level = latestReading?.LevelPercent;
        double? volume = latestReading?.VolumeMegaLitres;

        string band = "Healthy";
        string color = "Green";

        if (level.HasValue)
        {
            if (level.Value < 15.0) { band = "Critical"; color = "Red"; }
            else if (level.Value < 30.0) { band = "Low"; color = "Red"; }
            else if (level.Value < 50.0) { band = "Watch"; color = "Amber"; }
            else { band = "Healthy"; color = "Green"; }
        }

        return new DamResponseDto
        {
            Id = dam.Id,
            Name = dam.Name,
            Latitude = dam.Latitude,
            Longitude = dam.Longitude,
            CapacityMegaLitres = dam.CapacityMegaLitres,
            IsActive = dam.IsActive,
            AreaId = dam.AreaId,
            AreaName = dam.Area?.Name,
            LatestLevelPercent = level,
            LatestVolumeMegaLitres = volume,
            StatusBand = band,
            StatusColor = color,
            LastUpdatedSast = latestReading != null ? FormatSast(latestReading.RecordedAt) : null
        };
    }

    private static DamReadingResponseDto MapToReadingResponseDto(DamReading reading)
    {
        return new DamReadingResponseDto
        {
            Id = reading.Id,
            DamId = reading.DamId,
            DamName = reading.Dam?.Name ?? string.Empty,
            LevelPercent = reading.LevelPercent,
            VolumeMegaLitres = reading.VolumeMegaLitres,
            RecordedAtUtc = reading.RecordedAt,
            RecordedAtSast = FormatSast(reading.RecordedAt),
            Source = reading.Source
        };
    }

    private static string FormatSast(DateTime utcTime)
    {
        var sastTime = utcTime.AddHours(2);
        return sastTime.ToString("yyyy-MM-dd HH:mm SAST");
    }
}
