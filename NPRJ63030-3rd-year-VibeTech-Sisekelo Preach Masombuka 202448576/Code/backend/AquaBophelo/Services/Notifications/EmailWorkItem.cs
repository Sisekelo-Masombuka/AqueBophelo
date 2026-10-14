namespace AquaBophelo.Services.Notifications;

public class EmailWorkItem
{
    public string ToEmail { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string HtmlContent { get; set; } = string.Empty;
    public string? PlainTextContent { get; set; }
    public string Priority { get; set; } = "Normal"; // "Critical", "Normal"
    public DateTime QueuedAt { get; set; } = DateTime.UtcNow;
}
