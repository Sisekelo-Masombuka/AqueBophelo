using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Data;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Route("[controller]")]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly ILogger<ContactController> _logger;

    public ContactController(AppDbContext context, INotificationService notificationService, ILogger<ContactController> logger)
    {
        _context = context;
        _notificationService = notificationService;
        _logger = logger;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> SubmitContactForm([FromBody] ContactMessageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
        {
            return BadRequest(new { message = "Please provide a valid email address." });
        }

        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new { message = "Message content cannot be empty." });
        }

        var ticketRef = $"SPM-TICKET-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
        _logger.LogInformation("[CONTACT FORM] Received message from {Name} ({Email}), Ref: {Ref}", request.FullName, request.Email, ticketRef);

        // 1. Save to database as an IssueReport so Admin can review & manage it under /admin
        try
        {
            var issue = new IssueReport
            {
                TicketId = ticketRef,
                FullName = string.IsNullOrWhiteSpace(request.FullName) ? "Citizen Inquiry" : request.FullName.Trim(),
                UserEmail = request.Email.Trim(),
                IssueType = "General Inquiry",
                Area = "Kimberley",
                StreetAddress = string.IsNullOrWhiteSpace(request.Subject) ? "Public Web Inquiry" : request.Subject.Trim(),
                Description = request.Message.Trim(),
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.IssueReports.Add(issue);
            await _context.SaveChangesAsync();
        }
        catch (Exception dbEx)
        {
            _logger.LogError(dbEx, "Failed to persist contact inquiry to database for ticket {Ref}", ticketRef);
        }

        // 2. Dispatch confirmation receipt copy to the resident via INotificationService
        var subject = $"[Sol Plaatje Water Desk] Inquiry Received ({ticketRef})";
        var body = $"Dear {request.FullName},\n\nThank you for contacting Sol Plaatje Municipality Water Desk.\n\nWe have received your message regarding '{request.Subject ?? "Water Service Inquiry"}' (Reference: {ticketRef}).\nOur municipal support team will respond to your email within 24 hours.\n\nFor urgent water line emergencies, call our 24/7 Hotlines:\n• Emergency Water Line: 053 830 6100\n• Sol Plaatje Call Centre: 053 830 6911\n\nElke druppel tel • Metsi ke bophelo";

        try
        {
            await _notificationService.SendEmailAsync(request.Email, subject, body);
        }
        catch (Exception emailEx)
        {
            _logger.LogWarning("Could not dispatch resident confirmation email: {Message}", emailEx.Message);
        }

        // 3. Dispatch admin alert notice to municipal operations desk
        try
        {
            var adminNotice = $"[New Citizen Inquiry] {ticketRef} - {request.Subject ?? "Water Inquiry"}\n\nFrom: {request.FullName} ({request.Email})\nSubject: {request.Subject ?? "General Inquiry"}\nMessage:\n{request.Message}\n\nSubmitted at (UTC): {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}\nView and manage in Admin Command Center: https://aquabophelo.app/admin";
            await _notificationService.SendEmailAsync("water@solplaatje.org.za", $"[Admin Alert] New Inquiry {ticketRef}", adminNotice);
        }
        catch (Exception adminEx)
        {
            _logger.LogWarning("Admin notification notice: {Message}", adminEx.Message);
        }

        return Ok(new
        {
            message = "Thank you! Your inquiry has been submitted and registered with Sol Plaatje Municipal Water Desk.",
            referenceNumber = ticketRef,
            receivedAt = DateTime.UtcNow
        });
    }
}

public record ContactMessageRequest(string FullName, string Email, string? Subject, string Message);
