namespace AquaBophelo.Models;

public class TruckLocation
{
    public long Id { get; set; }

    public int TruckId { get; set; }
    public Truck? Truck { get; set; }

    public int? TripId { get; set; }
    public Trip? Trip { get; set; }

    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? SpeedKmh { get; set; }
    public double? Heading { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}
