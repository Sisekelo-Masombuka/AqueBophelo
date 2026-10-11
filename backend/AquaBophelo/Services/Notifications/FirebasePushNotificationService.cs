using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Notifications;

public class FirebasePushNotificationService : IPushNotificationService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<FirebasePushNotificationService> _logger;
    private readonly bool _isInitialized = false;

    public FirebasePushNotificationService(IConfiguration configuration, IServiceScopeFactory scopeFactory, ILogger<FirebasePushNotificationService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;

        try
        {
            if (FirebaseApp.DefaultInstance != null)
            {
                _isInitialized = true;
                return;
            }

            string serviceAccountPath = configuration["Firebase:ServiceAccountPath"] ?? "firebase-service-account.json";
            
            if (!Path.IsPathRooted(serviceAccountPath))
            {
                serviceAccountPath = Path.Combine(AppContext.BaseDirectory, serviceAccountPath);
            }

            if (File.Exists(serviceAccountPath))
            {
                FirebaseApp.Create(new AppOptions
                {
                    Credential = GoogleCredential.FromFile(serviceAccountPath)
                });
                _isInitialized = true;
                _logger.LogInformation("Firebase Admin SDK initialized successfully with service account file: {Path}", serviceAccountPath);
            }
            else
            {
                _logger.LogWarning("Firebase service account file not found at '{Path}'. Web push notifications will operate in dry-run mode.", serviceAccountPath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize Firebase Admin SDK. Web push notifications disabled.");
        }
    }

    public async Task<bool> SendPushNotificationAsync(string userId, string title, string body, Dictionary<string, string>? data = null)
    {
        if (string.IsNullOrWhiteSpace(userId)) return false;

        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var tokens = await db.DeviceTokens
            .Where(t => t.UserId == userId)
            .ToListAsync();

        if (tokens.Count == 0)
        {
            _logger.LogDebug("No registered FCM device tokens found for User {UserId}", userId);
            return false;
        }

        if (!_isInitialized)
        {
            _logger.LogInformation("[FCM DRY-RUN] Would send push notification to User {UserId} ({Count} devices): {Title} - {Body}", userId, tokens.Count, title, body);
            return true;
        }

        bool sentAny = false;
        var staleTokens = new List<DeviceToken>();

        foreach (var deviceToken in tokens)
        {
            try
            {
                var message = new Message
                {
                    Token = deviceToken.Token,
                    Notification = new Notification
                    {
                        Title = title,
                        Body = body
                    },
                    Data = data ?? new Dictionary<string, string>()
                };

                string response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
                _logger.LogInformation("Successfully sent FCM message {Response} to device token {TokenId}", response, deviceToken.Id);
                deviceToken.LastUsedAt = DateTime.UtcNow;
                sentAny = true;
            }
            catch (FirebaseMessagingException fex) when (fex.MessagingErrorCode == MessagingErrorCode.Unregistered || fex.MessagingErrorCode == MessagingErrorCode.InvalidArgument)
            {
                _logger.LogWarning("FCM token {TokenId} is invalid or unregistered. Marking for cleanup.", deviceToken.Id);
                staleTokens.Add(deviceToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dispatch FCM message to device token {TokenId}", deviceToken.Id);
            }
        }

        if (staleTokens.Count > 0)
        {
            db.DeviceTokens.RemoveRange(staleTokens);
        }

        await db.SaveChangesAsync();
        return sentAny;
    }

    public async Task<int> SendPushNotificationToAllAsync(string title, string body, Dictionary<string, string>? data = null)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var tokens = await db.DeviceTokens.ToListAsync();
        if (tokens.Count == 0) return 0;

        if (!_isInitialized)
        {
            _logger.LogInformation("[FCM DRY-RUN] Broadcast push to {Count} devices: {Title} - {Body}", tokens.Count, title, body);
            return tokens.Count;
        }

        int successCount = 0;
        var staleTokens = new List<DeviceToken>();

        foreach (var deviceToken in tokens)
        {
            try
            {
                var message = new Message
                {
                    Token = deviceToken.Token,
                    Notification = new Notification
                    {
                        Title = title,
                        Body = body
                    },
                    Data = data ?? new Dictionary<string, string>()
                };

                await FirebaseMessaging.DefaultInstance.SendAsync(message);
                successCount++;
                deviceToken.LastUsedAt = DateTime.UtcNow;
            }
            catch (FirebaseMessagingException fex) when (fex.MessagingErrorCode == MessagingErrorCode.Unregistered || fex.MessagingErrorCode == MessagingErrorCode.InvalidArgument)
            {
                staleTokens.Add(deviceToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed broadcast FCM to token {TokenId}", deviceToken.Id);
            }
        }

        if (staleTokens.Count > 0)
        {
            db.DeviceTokens.RemoveRange(staleTokens);
        }

        await db.SaveChangesAsync();
        return successCount;
    }

    public async Task RegisterDeviceTokenAsync(string userId, string token, string deviceType = "Web")
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token)) return;

        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var existing = await db.DeviceTokens.FirstOrDefaultAsync(t => t.UserId == userId && t.Token == token);
        if (existing == null)
        {
            db.DeviceTokens.Add(new DeviceToken
            {
                UserId = userId,
                Token = token,
                DeviceType = deviceType,
                CreatedAt = DateTime.UtcNow,
                LastUsedAt = DateTime.UtcNow
            });
        }
        else
        {
            existing.LastUsedAt = DateTime.UtcNow;
            existing.DeviceType = deviceType;
        }

        await db.SaveChangesAsync();
        _logger.LogInformation("FCM device token registered successfully for User {UserId}", userId);
    }

    public async Task UnregisterDeviceTokenAsync(string userId, string token)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token)) return;

        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var existing = await db.DeviceTokens.FirstOrDefaultAsync(t => t.UserId == userId && t.Token == token);
        if (existing != null)
        {
            db.DeviceTokens.Remove(existing);
            await db.SaveChangesAsync();
            _logger.LogInformation("FCM device token unregistered for User {UserId}", userId);
        }
    }
}
