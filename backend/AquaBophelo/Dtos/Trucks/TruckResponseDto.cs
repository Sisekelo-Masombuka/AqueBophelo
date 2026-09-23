namespace AquaBophelo.Dtos.Trucks;

public class TruckResponseDto
{
    public int Id { get; set; }
    public string RegistrationNumber { get; set; } = string.Empty;
    public double CapacityLitres { get; set; }
    public string Status { get; set; } = "Available"; // Available, OnTrip, Maintenance

    public string? DriverId { get; set; }
    public string? DriverName { get; set; }

    public double? LastLatitude { get; set; }
    public double? LastLongitude { get; set; }
    public DateTime? LastSeenAt { get; set; }
}
