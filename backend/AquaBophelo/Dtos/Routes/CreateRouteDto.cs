using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Dtos.Routes;

public class CreateRouteDto
{
    [Required(ErrorMessage = "Route name is required.")]
    [StringLength(100, ErrorMessage = "Route name cannot exceed 100 characters.")]
    public string Name { get; set; } = string.Empty;

    public int? AreaId { get; set; }

    public List<CreateRouteStopDto> Stops { get; set; } = new();
}
