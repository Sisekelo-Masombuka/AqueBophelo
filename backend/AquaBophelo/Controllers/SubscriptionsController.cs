using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Dtos.Subscriptions;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/[controller]")]
public class SubscriptionsController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionsController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMySubscriptions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var subs = await _subscriptionService.GetUserSubscriptionsAsync(userId);
        return Ok(subs);
    }

    [HttpPost]
    public async Task<IActionResult> Subscribe([FromBody] CreateSubscriptionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var sub = await _subscriptionService.SubscribeAsync(userId, dto);
        return Ok(sub);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Unsubscribe(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await _subscriptionService.UnsubscribeAsync(id, userId);
        if (!result) return NotFound(new { message = $"Subscription with ID {id} not found or does not belong to user." });

        return NoContent();
    }
}
