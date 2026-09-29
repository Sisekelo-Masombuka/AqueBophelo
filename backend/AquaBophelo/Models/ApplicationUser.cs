using Microsoft.AspNetCore.Identity;

namespace AquaBophelo.Models;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public int? AreaId { get; set; }
    public Area? Area { get; set; }
    public string PreferredLanguage { get; set; } = "EN";

    // Privacy & Notification Preferences
    public bool OptInEmailAlerts { get; set; } = true;
    public bool OptInSmsAlerts { get; set; } = true;
    public bool ShareLocationForTankers { get; set; } = true;
    public bool PublicProfile { get; set; } = false;

    // Profile Picture & Account Deletion Security
    public string? ProfilePictureUrl { get; set; }
    public string? DeleteOtpCode { get; set; }
    public DateTime? DeleteOtpExpiry { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
