using AquaBophelo.Dtos.Subscriptions;

namespace AquaBophelo.Services.Interfaces;

public interface ISubscriptionService
{
    Task<IEnumerable<SubscriptionResponseDto>> GetUserSubscriptionsAsync(string userId);
    Task<SubscriptionResponseDto> SubscribeAsync(string userId, CreateSubscriptionDto dto);
    Task<bool> UnsubscribeAsync(int subscriptionId, string userId);
}
