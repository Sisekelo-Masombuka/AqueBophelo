using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Dtos.Dams;

public class DamResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double CapacityMegaLitres { get; set; }
    public bool IsActive { get; set; }
    public int? AreaId { get; set; }
    public string? AreaName { get; set; }
    public double? LatestLevelPercent { get; set; }
    public double? LatestVolumeMegaLitres { get; set; }
    public string StatusBand { get; set; } = "Healthy"; // Healthy, Watch, Low, Critical
    public string StatusColor { get; set; } = "Green";   // Green, Amber, Red
    public string? LastUpdatedSast { get; set; }
}

public class CreateDamDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public double Latitude { get; set; }

    [Required]
    public double Longitude { get; set; }

    [Required, Range(0.1, 10000.0)]
    public double CapacityMegaLitres { get; set; }

    public int? AreaId { get; set; }
}

public class UpdateDamDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public double Latitude { get; set; }

    [Required]
    public double Longitude { get; set; }

    [Required, Range(0.1, 10000.0)]
    public double CapacityMegaLitres { get; set; }

    public bool IsActive { get; set; } = true;
    public int? AreaId { get; set; }
}

public class DamReadingResponseDto
{
    public int Id { get; set; }
    public int DamId { get; set; }
    public string DamName { get; set; } = string.Empty;
    public double LevelPercent { get; set; }
    public double VolumeMegaLitres { get; set; }
    public DateTime RecordedAtUtc { get; set; }
    public string RecordedAtSast { get; set; } = string.Empty;
    public string Source { get; set; } = "Manual";
}

public class CreateDamReadingDto
{
    [Required, Range(0.0, 100.0)]
    public double LevelPercent { get; set; }

    public double? VolumeMegaLitres { get; set; }
    public string Source { get; set; } = "Manual";
}
