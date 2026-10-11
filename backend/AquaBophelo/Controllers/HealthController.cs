using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public HealthController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetHealth()
    {
        return Ok(new
        {
            status = "ok",
            service = "AquaBophelo API",
            serverTimeUtc = DateTime.UtcNow,
            environment = _environment.EnvironmentName
        });
    }

    [HttpPost("test-email")]
    [AllowAnonymous]
    public async Task<IActionResult> TestEmail([FromServices] AquaBophelo.Services.Interfaces.IEmailSender emailSender, [FromQuery] string toEmail)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
            return BadRequest(new { message = "toEmail query parameter is required." });

        string subject = "AquaBophelo Brevo Integration Test";
        string html = @"
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #0f223d;'>
                <h2 style='color: #152e52;'>Sol Plaatje Municipal Water System</h2>
                <p style='color: #2e7d32; font-weight: bold;'>Brevo Email Service Successfully Integrated!</p>
                <p>This test email confirms that AquaBophelo backend is successfully connected to Brevo Transactional Email API.</p>
                <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                <p style='font-size: 12px; color: #64748b;'>Sol Plaatje Municipality &bull; Elke druppel tel &bull; Metsi ke bophelo</p>
            </div>";

        bool success = await emailSender.SendEmailAsync(toEmail, subject, html, "Brevo Email Service Successfully Integrated!");
        return Ok(new { success, recipient = toEmail, message = success ? "Email sent via Brevo API!" : "Failed to send email. Check backend logs." });
    }
}
