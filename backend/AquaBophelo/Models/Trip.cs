namespace AquaBophelo.Models;

public class Trip
{
    public int Id { get; set; }

    public int TruckId { get; set; }
    public Truck? Truck { get; set; }

    public string DriverId { get; set; } = string.Empty;
    public ApplicationUser? Driver { get; set; }

    public int RouteId { get; set; }
    public TruckRoute? Route { get; set; }

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAt { get; set; }
    public string Status { get; set; } = "Active"; // Active, Completed, Cancelled

    public ICollection<TripStop> TripStops { get; set; } = new List<TripStop>();
    public ICollection<TruckLocation> Locations { get; set; } = new List<TruckLocation>();
}
