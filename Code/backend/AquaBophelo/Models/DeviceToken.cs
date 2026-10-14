using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AquaBophelo.Models;

public class DeviceToken
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser? User { get; set; }

    [Required]
    [MaxLength(500)]
    public string Token { get; set; } = string.Empty;

    [MaxLength(50)]
    public string DeviceType { get; set; } = "Web";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime LastUsedAt { get; set; } = DateTime.UtcNow;
}
