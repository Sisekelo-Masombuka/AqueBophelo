namespace AquaBophelo.Dtos.Reports;

/// <summary>
/// Operational Analytics & Fleet Summary Data Transfer Object for Municipal Admin
/// </summary>
public class FleetReportSummaryDto
{
    // ==========================================
    // 1. Water Tanker Fleet Metrics
    // ==========================================
    public int TotalTrucks { get; set; }
    public int AvailableTrucks { get; set; }
    public int OnTripTrucks { get; set; }
    public int MaintenanceTrucks { get; set; }
    public double TotalFleetCapacityLitres { get; set; }

    // ==========================================
    // 2. Trip & Distribution Operations
    // ==========================================
    public int TotalTrips { get; set; }
    public int ActiveTrips { get; set; }
    public int CompletedTrips { get; set; }
    public int TotalStopsCompleted { get; set; }
    public double TotalLitresDelivered { get; set; }

    // ==========================================
    // 3. Municipal Water Grid & Reservoir Status
    // ==========================================
    public int TotalDams { get; set; }
    public double AverageDamLevelPercent { get; set; }
    public int CriticalDamsCount { get; set; }
    public int ActiveAlertsCount { get; set; }
    public int TotalMunicipalAreas { get; set; }

    // ==========================================
    // 4. Breakdown Summaries for Dashboard Widgets
    // ==========================================
    public List<AreaSummaryDto> AreasSummary { get; set; } = new();
    public List<DamSummaryDto> DamsSummary { get; set; } = new();

    // ==========================================
    // 5. Audit & Timestamp (Central Africa Time)
    // ==========================================
    public DateTime GeneratedAtUtc { get; set; } = DateTime.UtcNow;
    public string GeneratedAtFormatted => GeneratedAtUtc.AddHours(2).ToString("dd MMM yyyy, hh:mm:ss tt") + " (CAT)";
}

public class AreaSummaryDto
{
    public int AreaId { get; set; }
    public string AreaName { get; set; } = string.Empty;
    public int RoutesCount { get; set; }
    public int ActiveTripsCount { get; set; }
}

public class DamSummaryDto
{
    public int DamId { get; set; }
    public string DamName { get; set; } = string.Empty;
    public double CapacityMegaLitres { get; set; }
    public double LatestLevelPercent { get; set; }
    public string StatusBand { get; set; } = "Healthy";
    public string StatusColor { get; set; } = "Green";
}
