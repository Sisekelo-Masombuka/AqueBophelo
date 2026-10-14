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

        string safeFileName = Path.GetFileName(fileName).Replace(" ", "_");
        string objectKey = $"reports/{Guid.NewGuid()}_{safeFileName}";

        if (string.IsNullOrWhiteSpace(_options.AccountId) || string.IsNullOrWhiteSpace(_options.AccessKeyId) || string.IsNullOrWhiteSpace(_options.SecretAccessKey))
        {
            _logger.LogWarning("[R2StorageService] Cloudflare R2 credentials are not fully set in local secrets. Returning fallback upload path.");
            return ("/api/v1/reports/upload-photo", $"/api/v1/reports/photos/{objectKey}", objectKey);
        }

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

    private static void ValidateImageSignature(Stream stream)
    {
        if (!stream.CanSeek || stream.Length < 4) return;
        var originalPos = stream.Position;
        byte[] header = new byte[12];
        int bytesRead = stream.Read(header, 0, Math.Min(header.Length, (int)stream.Length));
        stream.Position = originalPos;

        if (bytesRead < 4)
        {
            throw new BadHttpRequestException("Invalid or corrupted image payload.");
        }

        // JPEG: FF D8 FF
        bool isJpeg = header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;
        // PNG: 89 50 4E 47
        bool isPng = header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47;
        // GIF: 47 49 46 38 ("GIF8")
        bool isGif = header[0] == 0x47 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x38;
        // WebP: 52 49 46 46 ("RIFF" ... "WEBP")
        bool isWebp = bytesRead >= 12 && header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
                      header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;

        if (!isJpeg && !isPng && !isGif && !isWebp)
        {
            throw new BadHttpRequestException("File content does not match a valid image signature (JPEG, PNG, GIF, WebP). Potential file spoofing detected.");
        }
    }

    public async Task<(string fileUrl, string objectKey)> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        ValidateFileMetadata(fileName, contentType);

        const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB maximum allowed image payload
        if (fileStream.CanSeek && fileStream.Length > MaxFileSizeBytes)
        {
            throw new BadHttpRequestException("Uploaded image exceeds the 5 MB maximum allowed file size.");
        }

        ValidateImageSignature(fileStream);

        string safeFileName = Path.GetFileName(fileName).Replace(" ", "_");
        string objectKey = $"reports/{Guid.NewGuid()}_{safeFileName}";

        if (string.IsNullOrWhiteSpace(_options.AccountId) || string.IsNullOrWhiteSpace(_options.AccessKeyId) || string.IsNullOrWhiteSpace(_options.SecretAccessKey))
        {
            _logger.LogWarning("[R2StorageService] Cloudflare R2 credentials are not fully set in local secrets. Saving to local uploads directory.");
            string localDir = Path.Combine(AppContext.BaseDirectory, "uploads", "reports");
            Directory.CreateDirectory(localDir);
            string localFilePath = Path.Combine(localDir, Path.GetFileName(objectKey));
            using (var fileStreamDest = new FileStream(localFilePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(fileStreamDest);
            }
            return ($"/api/v1/reports/photos/{objectKey}", objectKey);
        }

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
            string cleanObjKey = objectKey.Replace('/', Path.DirectorySeparatorChar).TrimStart(Path.DirectorySeparatorChar);
            string uploadsBase = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "uploads"));
            string localFilePath = Path.GetFullPath(Path.Combine(uploadsBase, cleanObjKey));
            if (!localFilePath.StartsWith(uploadsBase, StringComparison.OrdinalIgnoreCase))
            {
                throw new BadHttpRequestException("Access denied: Invalid object path.");
            }

            if (File.Exists(localFilePath))
            {
                var fs = new FileStream(localFilePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                string ext = Path.GetExtension(localFilePath).ToLowerInvariant();
                string mime = ext switch
                {
                    ".png" => "image/png",
                    ".webp" => "image/webp",
                    ".gif" => "image/gif",
                    _ => "image/jpeg"
                };
                return (fs, mime);
            }
            _logger.LogWarning("[R2StorageService] Credentials not configured and local file not found at {LocalPath}", localFilePath);
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
