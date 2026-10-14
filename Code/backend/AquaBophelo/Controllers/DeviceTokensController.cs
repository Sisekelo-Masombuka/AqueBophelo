using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DeviceTokensController : ControllerBase
{
    private readonly IPushNotificationService _pushService;

    public DeviceTokensController(IPushNotificationService pushService)
    {
        _pushService = pushService;
    }

    public record RegisterTokenDto(string Token, string DeviceType = "Web");
    public record UnregisterTokenDto(string Token);

    [HttpPost("register")]
    public async Task<IActionResult> RegisterToken([FromBody] RegisterTokenDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        if (string.IsNullOrWhiteSpace(dto.Token))
            return BadRequest(new { message = "FCM token cannot be empty." });

        await _pushService.RegisterDeviceTokenAsync(userId, dto.Token, dto.DeviceType);
        return Ok(new { message = "Device token registered successfully." });
    }

    [HttpDelete("unregister")]
    public async Task<IActionResult> UnregisterToken([FromBody] UnregisterTokenDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        if (string.IsNullOrWhiteSpace(dto.Token))
            return BadRequest(new { message = "FCM token cannot be empty." });

        await _pushService.UnregisterDeviceTokenAsync(userId, dto.Token);
        return Ok(new { message = "Device token unregistered successfully." });
    }
}
