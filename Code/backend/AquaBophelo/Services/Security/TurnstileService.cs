using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using AquaBophelo.Configuration;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Security;

public class TurnstileService : ITurnstileService
{
    private readonly HttpClient _httpClient;
    private readonly TurnstileOptions _options;
    private readonly ILogger<TurnstileService> _logger;
    private readonly IHostEnvironment _hostEnvironment;

    public TurnstileService(
        HttpClient httpClient,
        IOptions<TurnstileOptions> options,
        ILogger<TurnstileService> logger,
        IHostEnvironment hostEnvironment)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
        _hostEnvironment = hostEnvironment;
    }

    public async Task<bool> VerifyTokenAsync(string token, string? remoteIp = null)
    {
        // Development / Testing Environments: Permit explicit dummy test token or log warning if secret unset
        if (_hostEnvironment.IsDevelopment() || _hostEnvironment.EnvironmentName.Equals("Testing", StringComparison.OrdinalIgnoreCase))
        {
            if (token == "1x0000000000000000000000000000000AA")
            {
                _logger.LogInformation("[TurnstileService] Development dummy test token accepted.");
                return true;
            }

            if (string.IsNullOrWhiteSpace(_options.SecretKey))
            {
                _logger.LogWarning("[TurnstileService] SecretKey not configured in development. Allowing bypass.");
                return true;
            }
        }

        // Production Security Gate: Fail-Closed if SecretKey is missing
        if (string.IsNullOrWhiteSpace(_options.SecretKey))
        {
            _logger.LogCritical("[TurnstileService] Turnstile SecretKey is not configured in production. Rejecting verification request (Fail-Closed).");
            return false;
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
