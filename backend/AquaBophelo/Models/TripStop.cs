namespace AquaBophelo.Models;

public class TripStop
{
    public int Id { get; set; }

    public int TripId { get; set; }
    public Trip? Trip { get; set; }

    public int RouteStopId { get; set; }
    public RouteStop? RouteStop { get; set; }

    public DateTime? ArrivedAt { get; set; }
    public DateTime? DeliveryStartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    public double? LitresDelivered { get; set; }
    public string? DeliveryLocation { get; set; }
    public string? Notes { get; set; }

    public string StopStatus { get; set; } = "Pending"; // Pending, Arrived, Delivering, Completed
    public bool Completed { get; set; } = false;
}
