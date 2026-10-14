using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Dtos.Routes;

public class CreateRouteStopDto
{
    [Required(ErrorMessage = "Stop name is required.")]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public double Latitude { get; set; }

    [Required]
    public double Longitude { get; set; }

    [Range(1, 100, ErrorMessage = "Sequence must be a positive integer.")]
    public int Sequence { get; set; }
}
