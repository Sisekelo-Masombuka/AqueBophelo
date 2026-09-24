using AquaBophelo.Dtos.Auth;

namespace AquaBophelo.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserProfileDto?> GetProfileAsync(string userId);
}
