namespace AquaBophelo.Models;

public class DamReading
{
    public int Id { get; set; }
    public int DamId { get; set; }
    public Dam? Dam { get; set; }

    public double LevelPercent { get; set; }
    public double VolumeMegaLitres { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public string Source { get; set; } = "Manual"; // Manual, CSV, Simulator
}
