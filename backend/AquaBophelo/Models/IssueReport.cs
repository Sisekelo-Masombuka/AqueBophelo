using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Models;

public class IssueReport
{
    public int Id { get; set; }

    [Required]
    public string TicketId { get; set; } = string.Empty;

    public string? UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string IssueType { get; set; } = string.Empty;

    [Required]
    public string Area { get; set; } = string.Empty;

    [Required]
    public string StreetAddress { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string Status { get; set; } = "Pending"; // Pending, In Progress, Resolved, Rejected

    public string? AdminNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
