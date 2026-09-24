namespace AquaBophelo.Dtos.Alerts;

public class AlertResponseDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // DamLow, DamCritical, Truck, Announcement
    public string Severity { get; set; } = string.Empty; // Info, Warning, Critical
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int? DamId { get; set; }
    public string? DamName { get; set; }
    public int? AreaId { get; set; }
    public string? AreaName { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedAtSast { get; set; } = string.Empty;
    public string? CreatedByUserId { get; set; }
    public string? CreatedByName { get; set; }
}

public class CreateAlertDto
{
    public string Type { get; set; } = "Announcement";
    public string Severity { get; set; } = "Info";
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int? DamId { get; set; }
    public int? AreaId { get; set; }
}
