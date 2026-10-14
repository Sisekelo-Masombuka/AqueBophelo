using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Models;

public class ScheduledOutage
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string AreaName { get; set; } = string.Empty;

    public DateTime CutOffTime { get; set; }
    public DateTime ExpectedReturnTime { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    public string PostedBy { get; set; } = "Sol Plaatje Municipal Admin";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
