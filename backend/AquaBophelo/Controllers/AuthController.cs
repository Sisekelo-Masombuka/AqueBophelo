using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Dtos.Auth;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly INotificationService _notificationService;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(
        IAuthService authService,
        INotificationService notificationService,
        UserManager<ApplicationUser> userManager)
    {
        _authService = authService;
        _notificationService = notificationService;
        _userManager = userManager;
    }

    [HttpPost("send-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
        {
            return BadRequest(new { message = "Invalid email address." });
        }

        var subject = "AquaBophelo — Your Email Verification Code";
        var body = $"Sol Plaatje Municipal Water System\n\nYour 6-digit Email Verification OTP is: {request.Code}\n\nThis code will expire in 5 minutes (300 seconds).\nElke druppel tel • Metsi ke bophelo";

        await _notificationService.SendEmailAsync(request.Email, subject, body);
        return Ok(new { message = $"Verification OTP sent successfully to {request.Email}" });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
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
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
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
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
        {
            return BadRequest(new { message = "Invalid email address." });
        }

        await _authService.ForgotPasswordAsync(request.Email);
        return Ok(new { message = "If an account exists with that email, a password reset token has been sent to your inbox." });
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
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
    public async Task<IActionResult> SendDeleteAccountOtp()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null || string.IsNullOrEmpty(user.Email))
        {
            return NotFound(new { message = "User account not found." });
        }

        var code = Random.Shared.Next(100000, 999999).ToString();
        user.DeleteOtpCode = code;
        user.DeleteOtpExpiry = DateTime.UtcNow.AddMinutes(5);
        await _userManager.UpdateAsync(user);

        var subject = "AquaBophelo — Account Deletion Confirmation Code";
        var body = $"Sol Plaatje Municipal Water System\n\nSecurity Notice: A request was made to PERMANENTLY DELETE your AquaBophelo account.\n\nYour 6-digit Deletion OTP Code is: {code}\n\nThis code will expire in 5 minutes. If you did not initiate this request, please change your password immediately.";

        await _notificationService.SendEmailAsync(user.Email, subject, body);
        return Ok(new { message = $"Account deletion confirmation OTP sent to {user.Email}", demoCode = code });
    }

    /// <summary>
    /// DELETE: api/v1/auth/delete-account
    /// Verifies the email OTP code and permanently deletes the user account from the database.
    /// </summary>
    [HttpDelete("delete-account")]
    [Authorize]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null)
        {
            return NotFound(new { message = "User account not found." });
        }

        if (string.IsNullOrWhiteSpace(dto.OtpCode) || user.DeleteOtpCode != dto.OtpCode.Trim())
        {
            return BadRequest(new { message = "Invalid email OTP code. Please check your inbox and try again." });
        }

        if (user.DeleteOtpExpiry.HasValue && user.DeleteOtpExpiry.Value < DateTime.UtcNow)
        {
            return BadRequest(new { message = "OTP code has expired. Please request a new code." });
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Failed to delete user account." });
        }

        return Ok(new { message = "Your account has been permanently deleted from Sol Plaatje Municipal database." });
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
        user.OptInSmsAlerts = dto.OptInSmsAlerts;
        user.ShareLocationForTankers = dto.ShareLocationForTankers;
        user.PublicProfile = dto.PublicProfile;

        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            message = "Privacy settings updated successfully.",
            privacy = new
            {
                user.OptInEmailAlerts,
                user.OptInSmsAlerts,
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
}

public record SendOtpRequest(string Email, string Code);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);

public class DeleteAccountDto
{
    public string OtpCode { get; set; } = string.Empty;
}

public class UpdatePrivacyDto
{
    public bool OptInEmailAlerts { get; set; } = true;
    public bool OptInSmsAlerts { get; set; } = true;
    public bool ShareLocationForTankers { get; set; } = true;
    public bool PublicProfile { get; set; } = false;
}

public class UpdateProfilePictureDto
{
    public string ProfilePictureUrl { get; set; } = string.Empty;
}
