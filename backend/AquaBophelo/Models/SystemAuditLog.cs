using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Models;

public class SystemAuditLog
{
    [Key]
    public int Id { get; set; }

    public string? UserId { get; set; }
    public string? UserEmail { get; set; }
    public string? UserRole { get; set; }

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = "General"; // Auth, Trips, Dams, Reports, Vehicles, Outages, System

    [MaxLength(100)]
    public string EntityName { get; set; } = string.Empty;

    public string? EntityId { get; set; }

    [Required]
    public string Details { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? IpAddress { get; set; }

    public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
}
