using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Auth;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;
using AquaBophelo.Services.Notifications;

namespace AquaBophelo.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;
    private readonly IEmailSender _emailSender;
    private readonly IAuditLogger _auditLogger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        AppDbContext context,
        IEmailSender emailSender,
        IAuditLogger auditLogger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _context = context;
        _emailSender = emailSender;
        _auditLogger = auditLogger;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return await GenerateJwtTokenAsync(existingUser);
        }

        int? areaId = dto.AreaId;
        if (!areaId.HasValue && !string.IsNullOrWhiteSpace(dto.AreaName))
        {
            var matchedArea = await _context.Areas.FirstOrDefaultAsync(a => a.Name.ToLower() == dto.AreaName.ToLower());
            areaId = matchedArea?.Id;
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            AreaId = areaId,
            PreferredLanguage = string.IsNullOrWhiteSpace(dto.PreferredLanguage) ? "EN" : dto.PreferredLanguage.ToUpper(),
            EmailConfirmed = false
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadHttpRequestException($"Registration failed: {errors}");
        }

        // Assign Resident role by default
        if (!await _roleManager.RoleExistsAsync("Resident"))
        {
            await _roleManager.CreateAsync(new IdentityRole("Resident"));
        }
        await _userManager.AddToRoleAsync(user, "Resident");

        // Send Email Verification OTP
        try
        {
            await SendEmailOtpAsync(dto.Email, "EmailVerification");
        }
        catch (Exception ex)
        {
            // Log notice, allow registration completion
            System.Diagnostics.Debug.WriteLine($"Initial OTP send notice: {ex.Message}");
        }

        return await GenerateJwtTokenAsync(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            throw new BadHttpRequestException("Invalid email or password.");
        }

        return await GenerateJwtTokenAsync(user);
    }

    public async Task<UserProfileDto?> GetProfileAsync(string userId)
    {
        var user = await _context.Users
            .Include(u => u.Area)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "Resident";

        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            Role = primaryRole,
            AreaId = user.AreaId,
            AreaName = user.Area?.Name,
            PreferredLanguage = user.PreferredLanguage ?? "EN"
        };
    }

    public async Task<string> SendEmailOtpAsync(string email, string purpose = "EmailVerification")
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        // Check 60-second resend cooldown
        var recentOtp = await _context.EmailOtps
            .Where(o => o.Email == normalizedEmail && o.Purpose == purpose)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (recentOtp != null && recentOtp.LastResendAt.HasValue && (DateTime.UtcNow - recentOtp.LastResendAt.Value).TotalSeconds < 60)
        {
            throw new BadHttpRequestException("Please wait 60 seconds before requesting a new verification code.");
        }

        string otpCode = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
        string codeHash = HashOtpCode(otpCode);

        var emailOtp = new EmailOtp
        {
            Email = normalizedEmail,
            CodeHash = codeHash,
            Purpose = purpose,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsUsed = false,
            AttemptCount = 0,
            LastResendAt = DateTime.UtcNow
        };

        _context.EmailOtps.Add(emailOtp);
        await _context.SaveChangesAsync();

        var user = await _userManager.FindByEmailAsync(email);
        string recipientName = user?.FullName ?? "Resident";

        string html = EmailTemplateHelper.BuildOtpTemplate(recipientName, otpCode, purpose, 10);
        string subject = purpose switch
        {
            "PasswordReset" => "AquaBophelo — Password Reset Verification Code",
            "DeleteAccount" => "AquaBophelo — Account Deletion Verification Code",
            _ => "AquaBophelo — Email Verification Code"
        };

        await _emailSender.SendEmailAsync(email, subject, html, $"Your 6-digit verification code is: {otpCode}");
        return otpCode;
    }

    public async Task<bool> VerifyEmailOtpAsync(string email, string code, string purpose = "EmailVerification")
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var hashedInput = HashOtpCode(code);

        var otpRecord = await _context.EmailOtps
            .Where(o => o.Email == normalizedEmail && o.Purpose == purpose && !o.IsUsed && o.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otpRecord == null)
        {
            throw new BadHttpRequestException("Verification code has expired or is invalid. Please request a new code.");
        }

        if (otpRecord.AttemptCount >= 5)
        {
            otpRecord.IsUsed = true;
            await _context.SaveChangesAsync();
            throw new BadHttpRequestException("Maximum verification attempts exceeded. Please request a new code.");
        }

        otpRecord.AttemptCount++;

        if (otpRecord.CodeHash != hashedInput)
        {
            await _context.SaveChangesAsync();
            throw new BadHttpRequestException("Invalid verification code. Please check your email and try again.");
        }

        otpRecord.IsUsed = true;
        await _context.SaveChangesAsync();

        var user = await _userManager.FindByEmailAsync(email);
        if (user != null && (purpose == "EmailVerification" || purpose == "Default"))
        {
            user.EmailConfirmed = true;
            await _userManager.UpdateAsync(user);
        }

        return true;
    }

    public async Task<bool> ConfirmEmailAsync(string email, string tokenOrCode)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) throw new BadHttpRequestException("User account not found.");

        if (tokenOrCode.Trim().Length == 6 && int.TryParse(tokenOrCode.Trim(), out _))
        {
            return await VerifyEmailOtpAsync(email, tokenOrCode.Trim(), "EmailVerification");
        }

        var result = await _userManager.ConfirmEmailAsync(user, tokenOrCode);
        if (!result.Succeeded)
        {
            throw new BadHttpRequestException("Invalid or expired email confirmation token.");
        }
        return true;
    }

    public async Task<bool> ForgotPasswordAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return true; // Generic success to prevent email enumeration
        }

        await SendEmailOtpAsync(email, "PasswordReset");
        return true;
    }

    public async Task<bool> ResetPasswordAsync(string email, string tokenOrCode, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            throw new BadHttpRequestException("Invalid email or reset request.");
        }

        if (tokenOrCode.Trim().Length == 6 && int.TryParse(tokenOrCode.Trim(), out _))
        {
            await VerifyEmailOtpAsync(email, tokenOrCode.Trim(), "PasswordReset");

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new BadHttpRequestException($"Password reset failed: {errors}");
            }
            return true;
        }
        else
        {
            var result = await _userManager.ResetPasswordAsync(user, tokenOrCode, newPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new BadHttpRequestException($"Password reset failed: {errors}");
            }
            return true;
        }
    }

    private static string HashOtpCode(string code)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(code.Trim()));
        return Convert.ToBase64String(bytes);
    }

    private async Task<AuthResponseDto> GenerateJwtTokenAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "Resident";

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim(ClaimTypes.Name, user.FullName)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Fatal Security Error: 'Jwt:Key' is not configured in appsettings, environment variables, or user-secrets.");
        var jwtIssuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("Fatal Security Error: 'Jwt:Issuer' is not configured in appsettings, environment variables, or user-secrets.");
        var jwtAudience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("Fatal Security Error: 'Jwt:Audience' is not configured in appsettings, environment variables, or user-secrets.");
        var expiryMinutes = double.TryParse(_configuration["Jwt:ExpiryMinutes"], out var mins) ? mins : 120;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            Issuer = jwtIssuer,
            Audience = jwtAudience,
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new AuthResponseDto
        {
            Token = tokenHandler.WriteToken(token),
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            Role = primaryRole,
            PreferredLanguage = user.PreferredLanguage ?? "EN",
            ExpiresAt = expiresAt,
            Message = "Authentication successful"
        };
    }

    public async Task<bool> SoftDeleteAccountAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.ScheduledPermanentDeletionAt = DateTime.UtcNow.AddDays(30);

        await _userManager.UpdateAsync(user);

        await _auditLogger.LogAsync(
            action: "ACCOUNT_SOFT_DELETED",
            category: "Auth",
            details: $"User account for {user.Email} soft-deleted. Scheduled for permanent deletion on {user.ScheduledPermanentDeletionAt:dd MMM yyyy} (30-day grace period).",
            userId: user.Id,
            userEmail: user.Email,
            entityName: "ApplicationUser",
            entityId: user.Id
        );

        return true;
    }
}
