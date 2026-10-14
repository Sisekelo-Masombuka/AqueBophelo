using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Dtos.Trucks;

public class CreateTruckDto
{
    [Required(ErrorMessage = "Registration number is required.")]
    [StringLength(20, ErrorMessage = "Registration number cannot exceed 20 characters.")]
    public string RegistrationNumber { get; set; } = string.Empty;

    [Range(500, 50000, ErrorMessage = "Capacity must be between 500 and 50,000 litres.")]
    public double CapacityLitres { get; set; }
}
