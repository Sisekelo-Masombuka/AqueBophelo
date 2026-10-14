namespace AquaBophelo.Models;

public class Area
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public ICollection<Dam> Dams { get; set; } = new List<Dam>();
    public ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
    public ICollection<TruckRoute> Routes { get; set; } = new List<TruckRoute>();
}
