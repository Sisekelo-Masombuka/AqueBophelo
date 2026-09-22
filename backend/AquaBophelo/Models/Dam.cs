namespace AquaBophelo.Models;

public class Dam
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double CapacityMegaLitres { get; set; }
    public bool IsActive { get; set; } = true;

    public int? AreaId { get; set; }
    public Area? Area { get; set; }

    public ICollection<DamReading> Readings { get; set; } = new List<DamReading>();
}
