namespace AquaBophelo.Dtos.Subscriptions;

public class SubscriptionResponseDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string UserFullName { get; set; } = string.Empty;
    public int AreaId { get; set; }
    public string AreaName { get; set; } = string.Empty;
    public string Channel { get; set; } = "Email"; // Email, Sms
    public bool IsActive { get; set; } = true;
}

public class CreateSubscriptionDto
{
    public int AreaId { get; set; }
    public string Channel { get; set; } = "Email";
}
