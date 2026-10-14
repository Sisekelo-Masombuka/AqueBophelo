namespace AquaBophelo.Models;

public class AlertSubscription
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    public int AreaId { get; set; }
    public Area? Area { get; set; }

    public string Channel { get; set; } = "Email"; // Sms, Email
    public bool IsActive { get; set; } = true;
}
