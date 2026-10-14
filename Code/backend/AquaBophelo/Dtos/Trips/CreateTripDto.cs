using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Dtos.Trips;

public class CreateTripDto
{
    [Required]
    public int TruckId { get; set; }

    [Required]
    public string DriverId { get; set; } = string.Empty;

    [Required]
    public int RouteId { get; set; }
}
