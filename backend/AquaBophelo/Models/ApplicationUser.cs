using Microsoft.AspNetCore.Identity;

namespace AquaBophelo.Models;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public int? AreaId { get; set; }
    public Area? Area { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
