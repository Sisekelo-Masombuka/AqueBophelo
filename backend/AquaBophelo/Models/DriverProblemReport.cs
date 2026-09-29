using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Models;

public class DriverProblemReport
{
    public int Id { get; set; }

    public int? TripId { get; set; }
    public int? StopId { get; set; }

    public string DriverId { get; set; } = string.Empty;
    public string DriverName { get; set; } = string.Empty;
    public string VehicleRegistration { get; set; } = "542-KM NC";

    [Required]
    public string Category { get; set; } = "Vehicle problem"; // Vehicle problem, Road-access problem, Water point problem, Unable to deliver, Other

    [Required]
    public string Description { get; set; } = string.Empty;

    public string Status { get; set; } = "Open"; // Open, Reviewed, Resolved

    public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
}
