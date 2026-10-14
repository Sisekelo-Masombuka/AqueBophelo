namespace AquaBophelo.Configuration;

public class R2Options
{
    public const string Position = "R2";
    public string AccountId { get; set; } = string.Empty;
    public string AccessKeyId { get; set; } = string.Empty;
    public string SecretAccessKey { get; set; } = string.Empty;
    public string BucketName { get; set; } = "aquabophelo-uploads";
    public string PublicDomain { get; set; } = string.Empty;
}
