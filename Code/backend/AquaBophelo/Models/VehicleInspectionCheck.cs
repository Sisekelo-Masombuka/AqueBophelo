namespace AquaBophelo.Models;

public class VehicleInspectionCheck
{
    public int Id { get; set; }

    public string DriverId { get; set; } = string.Empty;
    public string DriverName { get; set; } = string.Empty;

    public int? TruckId { get; set; }
    public string VehicleRegistration { get; set; } = "542-KM NC";

    public bool BrakesOk { get; set; } = true;
    public bool TiresOk { get; set; } = true;
    public bool WaterSealOk { get; set; } = true;
    public bool LightsOk { get; set; } = true;

    public string OverallStatus { get; set; } = "Pass"; // Pass, PassWithWarnings, Fail
    public string? Remarks { get; set; }

    public DateTime InspectedAt { get; set; } = DateTime.UtcNow;
}
