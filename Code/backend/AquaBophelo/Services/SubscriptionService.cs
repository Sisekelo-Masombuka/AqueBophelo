using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Subscriptions;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly AppDbContext _context;

    public SubscriptionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SubscriptionResponseDto>> GetUserSubscriptionsAsync(string userId)
    {
        var subs = await _context.AlertSubscriptions
            .Include(s => s.User)
            .Include(s => s.Area)
            .Where(s => s.UserId == userId)
            .ToListAsync();

        return subs.Select(MapToSubscriptionDto);
    }

    public async Task<SubscriptionResponseDto> SubscribeAsync(string userId, CreateSubscriptionDto dto)
    {
        var existing = await _context.AlertSubscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId && s.AreaId == dto.AreaId && s.Channel == dto.Channel);

        if (existing != null)
        {
            existing.IsActive = true;
            await _context.SaveChangesAsync();
            await _context.Entry(existing).Reference(s => s.User).LoadAsync();
            await _context.Entry(existing).Reference(s => s.Area).LoadAsync();
            return MapToSubscriptionDto(existing);
        }

        var sub = new AlertSubscription
        {
            UserId = userId,
            AreaId = dto.AreaId,
            Channel = dto.Channel,
            IsActive = true
        };

        _context.AlertSubscriptions.Add(sub);
        await _context.SaveChangesAsync();

        await _context.Entry(sub).Reference(s => s.User).LoadAsync();
        await _context.Entry(sub).Reference(s => s.Area).LoadAsync();

        return MapToSubscriptionDto(sub);
    }

    public async Task<bool> UnsubscribeAsync(int subscriptionId, string userId)
    {
        var sub = await _context.AlertSubscriptions
            .FirstOrDefaultAsync(s => s.Id == subscriptionId && s.UserId == userId);

        if (sub == null) return false;

        _context.AlertSubscriptions.Remove(sub);
        await _context.SaveChangesAsync();
        return true;
    }

    private static SubscriptionResponseDto MapToSubscriptionDto(AlertSubscription sub)
    {
        return new SubscriptionResponseDto
        {
            Id = sub.Id,
            UserId = sub.UserId,
            UserEmail = sub.User?.Email ?? string.Empty,
            UserFullName = sub.User?.FullName ?? string.Empty,
            AreaId = sub.AreaId,
            AreaName = sub.Area?.Name ?? string.Empty,
            Channel = sub.Channel,
            IsActive = sub.IsActive
        };
    }
}
