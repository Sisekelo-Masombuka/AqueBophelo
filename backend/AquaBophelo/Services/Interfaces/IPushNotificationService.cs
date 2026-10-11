namespace AquaBophelo.Services.Interfaces;

public interface IPushNotificationService
{
    Task<bool> SendPushNotificationAsync(string userId, string title, string body, Dictionary<string, string>? data = null);
    Task<int> SendPushNotificationToAllAsync(string title, string body, Dictionary<string, string>? data = null);
    Task RegisterDeviceTokenAsync(string userId, string token, string deviceType = "Web");
    Task UnregisterDeviceTokenAsync(string userId, string token);
}
