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
}
