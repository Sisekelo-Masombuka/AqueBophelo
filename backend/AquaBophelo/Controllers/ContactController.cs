using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ContactController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly ILogger<ContactController> _logger;

    public ContactController(INotificationService notificationService, ILogger<ContactController> logger)
    {
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

        // Optionally send receipt copy to user via INotificationService
        var subject = $"[Sol Plaatje Water Desk] Inquiry Received ({ticketRef})";
        var body = $"Dear {request.FullName},\n\nThank you for contacting Sol Plaatje Municipality Water Desk.\n\nWe have received your message regarding '{request.Subject ?? "Water Service Inquiry"}' (Reference: {ticketRef}).\nOur municipal support team will respond to your email within 24 hours.\n\nFor urgent water line emergencies, call our 24/7 Hotlines:\n• Emergency Water Line: 053 830 6100\n• Sol Plaatje Call Centre: 053 830 6911\n\nElke druppel tel • Metsi ke bophelo";

        await _notificationService.SendEmailAsync(request.Email, subject, body);

        return Ok(new
        {
            message = "Thank you! Your message has been received by Sol Plaatje Municipal Water Desk.",
            referenceNumber = ticketRef,
            receivedAt = DateTime.UtcNow
        });
    }
}

public record ContactMessageRequest(string FullName, string Email, string? Subject, string Message);
