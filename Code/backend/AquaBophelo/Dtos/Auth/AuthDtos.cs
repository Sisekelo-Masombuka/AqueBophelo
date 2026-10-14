using System.ComponentModel.DataAnnotations;

namespace AquaBophelo.Dtos.Auth;

public class RegisterDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }
    public int? AreaId { get; set; }
    public string? AreaName { get; set; }
    public string PreferredLanguage { get; set; } = "EN";
    public string? TurnstileToken { get; set; }
}

public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public string? TurnstileToken { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? AreaName { get; set; }
    public string PreferredLanguage { get; set; } = "EN";
    public DateTime ExpiresAt { get; set; }
    public string Message { get; set; } = "Authentication successful";
}

public class UserProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty;
    public int? AreaId { get; set; }
    public string? AreaName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public bool OptInEmailAlerts { get; set; } = true;
    public bool ShareLocationForTankers { get; set; } = true;
    public bool PublicProfile { get; set; } = false;
    public string PreferredLanguage { get; set; } = "EN";
}

public class UpdateProfileDetailsDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public int? AreaId { get; set; }
    public string? AreaName { get; set; }
    public string? PreferredLanguage { get; set; }
}

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}
