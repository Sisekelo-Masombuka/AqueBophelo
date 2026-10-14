namespace AquaBophelo.Models;

public class TruckRoute
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public int? AreaId { get; set; }
    public Area? Area { get; set; }

    public ICollection<RouteStop> Stops { get; set; } = new List<RouteStop>();
    public ICollection<Trip> Trips { get; set; } = new List<Trip>();
}
