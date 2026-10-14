namespace AquaBophelo.Dtos.Routes;

public class RouteResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? AreaId { get; set; }
    public string? AreaName { get; set; }
    public List<RouteStopResponseDto> Stops { get; set; } = new();
}
