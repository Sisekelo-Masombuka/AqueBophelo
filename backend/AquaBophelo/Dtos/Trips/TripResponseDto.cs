namespace AquaBophelo.Dtos.Trips;

public class TripResponseDto
{
    public int Id { get; set; }
    public int TruckId { get; set; }
    public string TruckRegistration { get; set; } = string.Empty;
    public string DriverId { get; set; } = string.Empty;
    public string? DriverName { get; set; }
    public int RouteId { get; set; }
    public string? RouteName { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<TripStopResponseDto> Stops { get; set; } = new();
}
