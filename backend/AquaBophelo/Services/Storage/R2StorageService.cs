using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using AquaBophelo.Configuration;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services.Storage;

public class R2StorageService : IR2StorageService
{
    private readonly R2Options _options;
    private readonly ILogger<R2StorageService> _logger;
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif"
    };

    public R2StorageService(IOptions<R2Options> options, ILogger<R2StorageService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task<(string presignedUrl, string fileUrl, string objectKey)> GetPresignedUploadUrlAsync(string fileName, string contentType, int expirationMinutes = 15)
    {
        if (string.IsNullOrWhiteSpace(contentType) || !AllowedContentTypes.Contains(contentType))
        {
            throw new BadHttpRequestException("Invalid content type. Only image files (JPEG, PNG, WebP, GIF) are allowed.");
        }

        if (string.IsNullOrWhiteSpace(_options.AccountId) || string.IsNullOrWhiteSpace(_options.AccessKeyId) || string.IsNullOrWhiteSpace(_options.SecretAccessKey))
        {
            _logger.LogWarning("[R2StorageService] Cloudflare R2 credentials are not fully set in local secrets. Returning fallback upload path.");
            string fallbackKey = $"reports/{Guid.NewGuid()}_{Path.GetFileName(fileName)}";
            return ("http://localhost/mock-upload", "/pipe_leak.jpg", fallbackKey);
        }

        string safeFileName = Path.GetFileName(fileName).Replace(" ", "_");
        string objectKey = $"reports/{Guid.NewGuid()}_{safeFileName}";

        var s3Config = new AmazonS3Config
        {
            ServiceURL = $"https://{_options.AccountId}.r2.cloudflarestorage.com",
            ForcePathStyle = true
        };

        using var s3Client = new AmazonS3Client(_options.AccessKeyId, _options.SecretAccessKey, s3Config);

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _options.BucketName,
            Key = objectKey,
            Verb = HttpVerb.PUT,
            ContentType = contentType,
            Expires = DateTime.UtcNow.AddMinutes(expirationMinutes)
        };

        string presignedUrl = await Task.FromResult(s3Client.GetPreSignedURL(request));

        string fileUrl = !string.IsNullOrWhiteSpace(_options.PublicDomain)
            ? $"{_options.PublicDomain.TrimEnd('/')}/{objectKey}"
            : $"https://{_options.AccountId}.r2.cloudflarestorage.com/{_options.BucketName}/{objectKey}";

        _logger.LogInformation("[R2StorageService] Generated presigned R2 upload URL for object key {ObjectKey}", objectKey);

        return (presignedUrl, fileUrl, objectKey);
    }
}
