using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Dtos.Trucks;

public class UpdateTruckDto
{
    [Range(500, 50000, ErrorMessage = "Capacity must be between 500 and 50,000 litres.")]
    public double CapacityLitres { get; set; }

    [Required]
    [RegularExpression("^(Available|OnTrip|Maintenance)$", ErrorMessage = "Status must be 'Available', 'OnTrip', or 'Maintenance'.")]
    public string Status { get; set; } = "Available";
}
