namespace AquaBophelo.Models;

public class TripStop
{
    public int Id { get; set; }

    public int TripId { get; set; }
    public Trip? Trip { get; set; }

    public int RouteStopId { get; set; }
    public RouteStop? RouteStop { get; set; }

    public DateTime? ArrivedAt { get; set; }
    public bool Completed { get; set; } = false;
}
