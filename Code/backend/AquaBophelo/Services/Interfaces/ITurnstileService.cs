namespace AquaBophelo.Services.Interfaces;

public interface ITurnstileService
{
    Task<bool> VerifyTokenAsync(string token, string? remoteIp = null);
}
