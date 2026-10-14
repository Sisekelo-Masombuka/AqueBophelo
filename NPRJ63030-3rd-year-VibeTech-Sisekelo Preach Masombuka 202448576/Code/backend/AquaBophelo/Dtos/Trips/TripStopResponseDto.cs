namespace AquaBophelo.Dtos.Trips;

public class TripStopResponseDto
{
    public int Id { get; set; }
    public int TripId { get; set; }
    public int RouteStopId { get; set; }
    public string StopName { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int Sequence { get; set; }
    public DateTime? ArrivedAt { get; set; }
    public bool Completed { get; set; }

    // Human-readable Central Africa Time timestamp
    public string ArrivedAtFormatted => ArrivedAt.HasValue
        ? ArrivedAt.Value.AddHours(2).ToString("dd MMM yyyy, hh:mm tt") + " (CAT)"
        : "Not arrived yet";
}
