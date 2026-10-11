using AquaBophelo.Dtos.Auth;

namespace AquaBophelo.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserProfileDto?> GetProfileAsync(string userId);
    Task<bool> ForgotPasswordAsync(string email);
    Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
    Task<string> SendEmailOtpAsync(string email, string purpose = "EmailVerification");
    Task<bool> VerifyEmailOtpAsync(string email, string code, string purpose = "EmailVerification");
    Task<bool> ConfirmEmailAsync(string email, string token);
    Task<bool> SoftDeleteAccountAsync(string userId);
}
