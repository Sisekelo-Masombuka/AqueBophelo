namespace AquaBophelo.Models;

public class NotificationLog
{
    public int Id { get; set; }

    public int? AlertId { get; set; }
    public Alert? Alert { get; set; }

    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Alert"; // Alert, Outage, ReportUpdate, System
    public bool IsRead { get; set; } = false;

    public string Channel { get; set; } = "InApp"; // InApp, Sms, Email
    public string Status { get; set; } = "Sent"; // Sent, Failed, DryRun
    public string? Error { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}
