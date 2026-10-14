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

    // Human-readable Central Africa Time (CAT) timestamps
    public string StartedAtFormatted => StartedAt.AddHours(2).ToString("dd MMM yyyy, hh:mm tt") + " (CAT)";
    public string EndedAtFormatted => EndedAt.HasValue
        ? EndedAt.Value.AddHours(2).ToString("dd MMM yyyy, hh:mm tt") + " (CAT)"
        : "In progress";

    public List<TripStopResponseDto> Stops { get; set; } = new();
}
