using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AquaBophelo.Controllers;

/// <summary>
/// Health-check and infrastructure diagnostics endpoints for uptime monitors.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public HealthController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    /// <summary>
    /// Performs a health check to verify backend API availability and server time.
    /// </summary>
    /// <returns>Uptime status, service name, UTC timestamp, and hosting environment.</returns>
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

    /// <summary>
    /// Kubernetes/Container Liveness Probe: Confirms the Web API process is alive and responsive.
    /// </summary>
    [HttpGet("live")]
    [AllowAnonymous]
    public IActionResult GetLiveness()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }

    /// <summary>
    /// Kubernetes/Container Readiness Probe: Verifies active database connectivity before accepting traffic.
    /// </summary>
    [HttpGet("ready")]
    [AllowAnonymous]
    public async Task<IActionResult> GetReadiness([FromServices] AquaBophelo.Data.AppDbContext context)
    {
        var canConnect = await context.Database.CanConnectAsync();
        if (!canConnect)
        {
            return StatusCode(503, new { status = "unhealthy", message = "Database connection unavailable." });
        }

        return Ok(new { status = "healthy", database = "connected", timestamp = DateTime.UtcNow });
    }

    [HttpPost("test-email")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> TestEmail([FromServices] AquaBophelo.Services.Interfaces.IEmailSender emailSender, [FromQuery] string toEmail)
    {
        if (string.IsNullOrWhiteSpace(toEmail) || !toEmail.Contains("@"))
            return BadRequest(new { message = "Valid toEmail query parameter is required." });

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

    [HttpGet("test-sentry")]
    [Authorize(Roles = "Admin")]
    public IActionResult TestSentry()
    {
        if (!_environment.IsDevelopment())
        {
            return Forbid();
        }
        throw new InvalidOperationException("AquaBophelo Backend Sentry Verification Exception - Sol Plaatje Municipal Water Telemetry System");
    }
}
