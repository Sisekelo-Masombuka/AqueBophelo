namespace AquaBophelo.Models;

public class Alert
{
    public int Id { get; set; }
    public string Type { get; set; } = "Announcement"; // DamLow, DamCritical, Truck, Announcement
    public string Severity { get; set; } = "Info"; // Info, Warning, Critical
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public int? DamId { get; set; }
    public Dam? Dam { get; set; }

    public int? AreaId { get; set; }
    public Area? Area { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? CreatedByUserId { get; set; }
    public ApplicationUser? CreatedByUser { get; set; }
}
