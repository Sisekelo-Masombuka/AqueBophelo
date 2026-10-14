namespace AquaBophelo.Services.Interfaces;

public interface IEmailSender
{
    Task<bool> SendEmailAsync(string toEmail, string subject, string htmlContent, string? plainTextContent = null);
}
