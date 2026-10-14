namespace AquaBophelo.Models;

public class RouteStop
{
    public int Id { get; set; }
    public int RouteId { get; set; }
    public TruckRoute? Route { get; set; }

    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int Sequence { get; set; }
}
