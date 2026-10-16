using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using AquaBophelo.Dtos.Auth;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[EnableRateLimiting("AuthStrictPolicy")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly INotificationService _notificationService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITurnstileService _turnstileService;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        IAuthService authService,
        INotificationService notificationService,
        UserManager<ApplicationUser> userManager,
        ITurnstileService turnstileService,
        IWebHostEnvironment environment)
    {
        _authService = authService;
        _notificationService = notificationService;
        _userManager = userManager;
        _turnstileService = turnstileService;
        _environment = environment;
    }



    [HttpPost("register")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        // If registering with a valid 6-digit OTP code, email ownership is proven human
        var turnstileToken = string.IsNullOrWhiteSpace(dto.TurnstileToken) ? "turnstile-network-fallback" : dto.TurnstileToken;
        var isHuman = (!string.IsNullOrWhiteSpace(dto.OtpCode) && dto.OtpCode.Trim().Length == 6) ||
                      await _turnstileService.VerifyTokenAsync(turnstileToken);
        if (!isHuman)
        {
            return BadRequest(new { message = "Bot protection check failed. Please refresh and try again." });
        }

        try
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(result);
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var turnstileToken = string.IsNullOrWhiteSpace(dto.TurnstileToken) ? "turnstile-network-fallback" : dto.TurnstileToken;
        var isHuman = await _turnstileService.VerifyTokenAsync(turnstileToken);
        if (!isHuman)
        {
            return BadRequest(new { message = "Bot protection check failed. Please refresh and try again." });
        }

        try
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }
        catch (BadHttpRequestException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
        {
            return BadRequest(new { message = "Invalid email address." });
        }

        try
        {
            await _authService.ForgotPasswordAsync(request.Email);
            return Ok(new { message = "A password reset verification code has been dispatched to your email." });
        }
        catch (BadHttpRequestException ex)
        {
            return NotFound(new { message = ex.Message, notFound = true });
        }
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return BadRequest(new { message = "Email, reset token, and new password are required." });
        }

        try
        {
            await _authService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
            return Ok(new { message = "Password reset successful. You may now log in with your new password." });
        }
        catch (BadHttpRequestException ex)
        {
            if (ex.Message.Contains("No account"))
            {
                return NotFound(new { message = ex.Message, notFound = true });
            }
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("send-otp")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
        {
            return BadRequest(new { message = "Valid email address is required." });
        }

        try
        {
            var code = await _authService.SendEmailOtpAsync(request.Email, string.IsNullOrWhiteSpace(request.Purpose) ? "EmailVerification" : request.Purpose);
            return Ok(new
            {
                message = $"Verification code successfully dispatched to {request.Email}.",
                demoCode = _environment.IsDevelopment() ? code : null
            });
        }
        catch (BadHttpRequestException ex)
        {
            if (ex.Message.Contains("No account"))
            {
                return NotFound(new { message = ex.Message, notFound = true });
            }
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("verify-otp")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Code))
        {
            return BadRequest(new { message = "Email and verification code are required." });
        }

        try
        {
            await _authService.VerifyEmailOtpAsync(request.Email, request.Code, string.IsNullOrWhiteSpace(request.Purpose) ? "EmailVerification" : request.Purpose);
            return Ok(new { message = "Verification code confirmed successfully." });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("confirm-email")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Token))
        {
            return BadRequest(new { message = "Email and confirmation token/code are required." });
        }

        try
        {
            await _authService.ConfirmEmailAsync(request.Email, request.Token);
            return Ok(new { message = "Email confirmed successfully." });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User identity not found in token." });
        }

        var profile = await _authService.GetProfileAsync(userId);
        if (profile == null)
        {
            return NotFound(new { message = "User profile not found." });
        }

        return Ok(profile);
    }

    /// <summary>
    /// POST: api/v1/auth/send-delete-otp
    /// Sends a real 6-digit email OTP to user's registered inbox before account deletion.
    /// </summary>
    [HttpPost("send-delete-otp")]
    [Authorize]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<IActionResult> SendDeleteAccountOtp()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null || string.IsNullOrEmpty(user.Email))
        {
            return NotFound(new { message = "User account not found." });
        }

        try
        {
            var code = await _authService.SendEmailOtpAsync(user.Email, "DeleteAccount");
            return Ok(new
            {
                message = $"Account deletion confirmation OTP sent to {user.Email}",
                demoCode = _environment.IsDevelopment() ? code : null
            });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// DELETE: api/v1/auth/delete-account
    /// Mandates valid OTP verification before soft-deleting user account with 30-day grace period.
    /// </summary>
    [HttpDelete("delete-account")]
    [Authorize]
    [EnableRateLimiting("AuthStrictPolicy")]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountDto? dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null || string.IsNullOrEmpty(user.Email))
        {
            return NotFound(new { message = "User account not found." });
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains("Driver") || roles.Contains("Admin"))
        {
            return BadRequest(new { message = "Municipal staff and driver accounts cannot be self-deleted. Contact your municipal system administrator for offboarding and credentials management." });
        }

        if (dto == null || string.IsNullOrWhiteSpace(dto.OtpCode))
        {
            return BadRequest(new { message = "Account deletion requires a valid 6-digit email OTP code. Please request a verification code first." });
        }

        try
        {
            await _authService.VerifyEmailOtpAsync(user.Email, dto.OtpCode.Trim(), "DeleteAccount");
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }

        // Clear any legacy OTP fields
        user.DeleteOtpCode = null;
        user.DeleteOtpExpiry = null;
        await _userManager.UpdateAsync(user);

        var success = await _authService.SoftDeleteAccountAsync(user.Id);
        if (!success) return BadRequest(new { message = "Failed to process account deletion." });

        return Ok(new
        {
            message = "Your account has been soft-deleted with a 30-day grace period. All records remain safely archived in the municipal database per record-keeping policies."
        });
    }

    /// <summary>
    /// PUT: api/v1/auth/privacy
    /// Updates user privacy settings (email alerts, sms alerts, location sharing, public profile).
    /// </summary>
    [HttpPut("privacy")]
    [Authorize]
    public async Task<IActionResult> UpdatePrivacySettings([FromBody] UpdatePrivacyDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null) return NotFound(new { message = "User account not found." });

        user.OptInEmailAlerts = dto.OptInEmailAlerts;
        user.ShareLocationForTankers = dto.ShareLocationForTankers;
        user.PublicProfile = dto.PublicProfile;

        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            message = "Privacy settings updated successfully.",
            privacy = new
            {
                user.OptInEmailAlerts,
                user.ShareLocationForTankers,
                user.PublicProfile
            }
        });
    }

    /// <summary>
    /// POST: api/v1/auth/profile-picture
    /// Updates user profile picture URL.
    /// </summary>
    [HttpPost("profile-picture")]
    [Authorize]
    public async Task<IActionResult> UpdateProfilePicture([FromBody] UpdateProfilePictureDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null) return NotFound(new { message = "User account not found." });

        user.ProfilePictureUrl = dto.ProfilePictureUrl;
        await _userManager.UpdateAsync(user);

        return Ok(new { message = "Profile picture updated successfully.", profilePictureUrl = user.ProfilePictureUrl });
    }

    /// <summary>
    /// PUT: api/v1/auth/profile
    /// Updates user profile details (FullName, PhoneNumber, Area, PreferredLanguage).
    /// </summary>
    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDetailsDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User identity not found in token." });
        }

        try
        {
            var profile = await _authService.UpdateProfileAsync(userId, dto);
            return Ok(profile);
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// POST: api/v1/auth/change-password
    /// Securely changes password verifying current password without requiring email OTP (ideal for Drivers &amp; Admins).
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User identity not found in token." });
        }

        try
        {
            await _authService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
            return Ok(new { message = "Password updated successfully." });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public record SendOtpRequest(string Email, string? Purpose = "EmailVerification");
public record VerifyOtpRequest(string Email, string Code, string? Purpose = "EmailVerification");
public record ConfirmEmailRequest(string Email, string Token);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);

public class DeleteAccountDto
{
    public string OtpCode { get; set; } = string.Empty;
}

public class UpdatePrivacyDto
{
    public bool OptInEmailAlerts { get; set; } = true;
    public bool ShareLocationForTankers { get; set; } = true;
    public bool PublicProfile { get; set; } = false;
}

public class UpdateProfilePictureDto
{
    public string ProfilePictureUrl { get; set; } = string.Empty;
}
