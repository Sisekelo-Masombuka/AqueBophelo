namespace AquaBophelo.Models;

public class Truck
{
    public int Id { get; set; }
    public string RegistrationNumber { get; set; } = string.Empty;
    public double CapacityLitres { get; set; }
    public string Status { get; set; } = "Available"; // Available, OnTrip, Maintenance

    public string? DriverId { get; set; }
    public ApplicationUser? Driver { get; set; }

    public double? LastLatitude { get; set; }
    public double? LastLongitude { get; set; }
    public DateTime? LastSeenAt { get; set; }

    public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    public ICollection<TruckLocation> Locations { get; set; } = new List<TruckLocation>();
}
