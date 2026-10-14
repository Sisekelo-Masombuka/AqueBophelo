namespace AquaBophelo.Configuration;

public class TurnstileOptions
{
    public const string Position = "Turnstile";
    public string SecretKey { get; set; } = string.Empty;
    public string SiteKey { get; set; } = string.Empty;
}
