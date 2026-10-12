namespace AquaBophelo.Services.Interfaces;

public interface IR2StorageService
{
    Task<(string presignedUrl, string fileUrl, string objectKey)> GetPresignedUploadUrlAsync(string fileName, string contentType, int expirationMinutes = 15);
    Task<(string fileUrl, string objectKey)> UploadFileAsync(Stream fileStream, string fileName, string contentType);
    Task<(Stream? contentStream, string contentType)> GetFileStreamAsync(string objectKey);
}
