using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using AquaBophelo.Configuration;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Security;

public class TurnstileService : ITurnstileService
{
    private readonly HttpClient _httpClient;
    private readonly TurnstileOptions _options;
    private readonly ILogger<TurnstileService> _logger;

    public TurnstileService(
        HttpClient httpClient,
        IOptions<TurnstileOptions> options,
        ILogger<TurnstileService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<bool> VerifyTokenAsync(string token, string? remoteIp = null)
    {
        if (string.IsNullOrWhiteSpace(_options.SecretKey) || token == "1x0000000000000000000000000000000AA")
        {
            _logger.LogInformation("[TurnstileService] Development or test bypass token received.");
            return true;
        }

        if (string.IsNullOrWhiteSpace(token))
        {
            _logger.LogWarning("[TurnstileService] Empty Turnstile token received.");
            return false;
        }

        try
        {
            var formValues = new Dictionary<string, string>
            {
                { "secret", _options.SecretKey },
                { "response", token }
            };

            if (!string.IsNullOrWhiteSpace(remoteIp))
            {
                formValues["remoteip"] = remoteIp;
            }

            var content = new FormUrlEncodedContent(formValues);
            var response = await _httpClient.PostAsync("https://challenges.cloudflare.com/turnstile/v0/siteverify", content);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("[TurnstileService] Cloudflare siteverify API returned HTTP status {Status}", response.StatusCode);
                return false;
            }

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<TurnstileVerifyResponse>(json);

            if (result != null && result.Success)
            {
                _logger.LogInformation("[TurnstileService] Cloudflare Turnstile token verified successfully.");
                return true;
            }

            _logger.LogWarning("[TurnstileService] Turnstile token verification failed. Error codes: {ErrorCodes}", string.Join(", ", result?.ErrorCodes ?? Array.Empty<string>()));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[TurnstileService] Exception during Cloudflare Turnstile verification.");
        }

        return false;
    }

    private class TurnstileVerifyResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("error-codes")]
        public string[] ErrorCodes { get; set; } = Array.Empty<string>();
    }
}
