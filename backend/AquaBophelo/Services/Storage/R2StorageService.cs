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

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    };

    public R2StorageService(IOptions<R2Options> options, ILogger<R2StorageService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    private static void ValidateFileMetadata(string fileName, string contentType)
    {
        if (string.IsNullOrWhiteSpace(contentType) || !AllowedContentTypes.Contains(contentType))
        {
            throw new BadHttpRequestException("Invalid content type. Only image files (JPEG, PNG, WebP, GIF) are allowed.");
        }

        var ext = Path.GetExtension(fileName);
        if (string.IsNullOrWhiteSpace(ext) || !AllowedExtensions.Contains(ext))
        {
            throw new BadHttpRequestException("Invalid file extension. Only .jpg, .jpeg, .png, .webp, and .gif files are allowed.");
        }
    }

    public async Task<(string presignedUrl, string fileUrl, string objectKey)> GetPresignedUploadUrlAsync(string fileName, string contentType, int expirationMinutes = 15)
    {
        ValidateFileMetadata(fileName, contentType);

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

    public async Task<(string fileUrl, string objectKey)> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        ValidateFileMetadata(fileName, contentType);

        if (string.IsNullOrWhiteSpace(_options.AccountId) || string.IsNullOrWhiteSpace(_options.AccessKeyId) || string.IsNullOrWhiteSpace(_options.SecretAccessKey))
        {
            _logger.LogWarning("[R2StorageService] Cloudflare R2 credentials are not fully set in local secrets. Returning fallback upload path.");
            string fallbackKey = $"reports/{Guid.NewGuid()}_{Path.GetFileName(fileName)}";
            return ("/pipe_leak.jpg", fallbackKey);
        }

        string safeFileName = Path.GetFileName(fileName).Replace(" ", "_");
        string objectKey = $"reports/{Guid.NewGuid()}_{safeFileName}";

        var s3Config = new AmazonS3Config
        {
            ServiceURL = $"https://{_options.AccountId}.r2.cloudflarestorage.com",
            ForcePathStyle = true
        };

        using var s3Client = new AmazonS3Client(_options.AccessKeyId, _options.SecretAccessKey, s3Config);

        var putRequest = new PutObjectRequest
        {
            BucketName = _options.BucketName,
            Key = objectKey,
            InputStream = fileStream,
            ContentType = contentType,
            DisablePayloadSigning = true
        };

        await s3Client.PutObjectAsync(putRequest);

        string fileUrl = !string.IsNullOrWhiteSpace(_options.PublicDomain)
            ? $"{_options.PublicDomain.TrimEnd('/')}/{objectKey}"
            : $"/api/v1/reports/photos/{objectKey}";

        _logger.LogInformation("[R2StorageService] Directly uploaded image to Cloudflare R2: {ObjectKey}", objectKey);

        return (fileUrl, objectKey);
    }

    public async Task<(Stream? contentStream, string contentType)> GetFileStreamAsync(string objectKey)
    {
        if (string.IsNullOrWhiteSpace(_options.AccountId) || string.IsNullOrWhiteSpace(_options.AccessKeyId) || string.IsNullOrWhiteSpace(_options.SecretAccessKey))
        {
            _logger.LogWarning("[R2StorageService] Credentials not configured. Unable to fetch object stream for {ObjectKey}", objectKey);
            return (null, "image/jpeg");
        }

        try
        {
            var s3Config = new AmazonS3Config
            {
                ServiceURL = $"https://{_options.AccountId}.r2.cloudflarestorage.com",
                ForcePathStyle = true
            };

            using var s3Client = new AmazonS3Client(_options.AccessKeyId, _options.SecretAccessKey, s3Config);

            var getRequest = new GetObjectRequest
            {
                BucketName = _options.BucketName,
                Key = objectKey
            };

            var response = await s3Client.GetObjectAsync(getRequest);
            var memoryStream = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            string contentType = response.Headers.ContentType ?? "image/jpeg";
            return (memoryStream, contentType);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[R2StorageService] Failed to retrieve stream for object {ObjectKey}", objectKey);
            return (null, "image/jpeg");
        }
    }
}
