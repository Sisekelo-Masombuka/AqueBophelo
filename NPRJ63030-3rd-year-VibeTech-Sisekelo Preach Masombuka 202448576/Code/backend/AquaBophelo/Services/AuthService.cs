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
        var normalizedEmail = dto.Email.Trim().ToUpperInvariant();
        var existingUser = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);

        if (existingUser != null)
        {
            if (existingUser.IsDeleted)
            {
                throw new BadHttpRequestException("This account was previously deactivated. Please contact municipal support to reactivate your account.");
            }
            throw new BadHttpRequestException("An account with this email address already exists. Please sign in instead.");
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
        var normalizedEmail = dto.Email.Trim().ToUpperInvariant();
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);

        if (user == null)
        {
            throw new BadHttpRequestException("Invalid email or password.");
        }

        // AUTH-05: Check deactivated / soft-deleted accounts
        if (user.IsDeleted)
        {
            throw new BadHttpRequestException("This account has been deactivated. Please contact municipal support or register a new account.");
        }

        // AUTH-04: Check if account is currently locked out
        if (await _userManager.IsLockedOutAsync(user))
        {
            var lockoutEnd = await _userManager.GetLockoutEndDateAsync(user);
            var remainingMinutes = lockoutEnd.HasValue
                ? (int)Math.Max(1, Math.Ceiling((lockoutEnd.Value - DateTimeOffset.UtcNow).TotalMinutes))
                : 15;
            throw new BadHttpRequestException($"Account is temporarily locked due to multiple failed login attempts. Please try again in {remainingMinutes} minute(s).");
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
        {
            // Record failed attempt
            await _userManager.AccessFailedAsync(user);

            if (await _userManager.IsLockedOutAsync(user))
            {
                await _auditLogger.LogAsync(
                    action: "USER_LOCKED_OUT",
                    category: "Auth",
                    details: $"Account for '{user.Email}' has been temporarily locked out after 5 consecutive failed attempts.",
                    userId: user.Id,
                    userEmail: user.Email
                );
                throw new BadHttpRequestException("Account has been temporarily locked due to 5 failed login attempts. Please try again in 15 minutes.");
            }

            throw new BadHttpRequestException("Invalid email or password.");
        }

        // Reset failed count on successful login
        await _userManager.ResetAccessFailedCountAsync(user);

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
            ProfilePictureUrl = user.ProfilePictureUrl,
            OptInEmailAlerts = user.OptInEmailAlerts,
            ShareLocationForTankers = user.ShareLocationForTankers,
            PublicProfile = user.PublicProfile,
            PreferredLanguage = user.PreferredLanguage ?? "EN"
        };
    }

    public async Task<string> SendEmailOtpAsync(string email, string purpose = "EmailVerification")
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        // If purpose is PasswordReset, check if user exists.
        // Prevents wasting email delivery quota on non-existent accounts.
        if (purpose == "PasswordReset")
        {
            var targetUser = await _context.Users
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail.ToUpperInvariant());
            if (targetUser == null)
            {
                throw new BadHttpRequestException("No account was found with this email address. Please create an account to get started.");
            }
            if (targetUser.IsDeleted)
            {
                throw new BadHttpRequestException("This account has been deactivated. Please contact municipal support to reactivate your account.");
            }
        }

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
        var normalizedEmail = email.Trim().ToUpperInvariant();
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);
        if (user == null)
        {
            throw new BadHttpRequestException("No account was found with this email address. Please create an account to get started.");
        }
        if (user.IsDeleted)
        {
            throw new BadHttpRequestException("This account has been deactivated. Please contact municipal support to reactivate your account.");
        }

        await SendEmailOtpAsync(email, "PasswordReset");
        return true;
    }

    public async Task<bool> ResetPasswordAsync(string email, string tokenOrCode, string newPassword)
    {
        var normalizedEmail = email.Trim().ToUpperInvariant();
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);
        if (user == null)
        {
            throw new BadHttpRequestException("No account was found with this email address. Please create an account to get started.");
        }
        if (user.IsDeleted)
        {
            throw new BadHttpRequestException("This account has been deactivated. Please contact municipal support to reactivate your account.");
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
            PhoneNumber = user.PhoneNumber,
            ProfilePictureUrl = user.ProfilePictureUrl,
            AreaName = user.Area?.Name,
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

    public async Task<UserProfileDto> UpdateProfileAsync(string userId, UpdateProfileDetailsDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Area)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) throw new BadHttpRequestException("User account not found.");

        user.FullName = dto.FullName.Trim();
        if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
        {
            user.PhoneNumber = dto.PhoneNumber.Trim();
        }

        if (dto.AreaId.HasValue)
        {
            user.AreaId = dto.AreaId.Value;
        }
        else if (!string.IsNullOrWhiteSpace(dto.AreaName))
        {
            var matchedArea = await _context.Areas.FirstOrDefaultAsync(a => a.Name.ToLower() == dto.AreaName.ToLower());
            if (matchedArea != null) user.AreaId = matchedArea.Id;
        }

        if (!string.IsNullOrWhiteSpace(dto.PreferredLanguage))
        {
            user.PreferredLanguage = dto.PreferredLanguage.ToUpperInvariant();
        }

        await _userManager.UpdateAsync(user);

        await _auditLogger.LogAsync(
            action: "PROFILE_UPDATED",
            category: "Auth",
            details: $"Profile updated for user {user.Email}. Phone: {user.PhoneNumber}, AreaId: {user.AreaId}.",
            userId: user.Id,
            userEmail: user.Email,
            entityName: "ApplicationUser",
            entityId: user.Id
        );

        return (await GetProfileAsync(userId))!;
    }

    public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) throw new BadHttpRequestException("User account not found.");

        var passwordCheck = await _userManager.CheckPasswordAsync(user, currentPassword);
        if (!passwordCheck)
        {
            throw new BadHttpRequestException("Current password is incorrect.");
        }

        var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadHttpRequestException($"Password change failed: {errors}");
        }

        await _auditLogger.LogAsync(
            action: "PASSWORD_CHANGED",
            category: "Auth",
            details: $"Password changed directly for user {user.Email}.",
            userId: user.Id,
            userEmail: user.Email,
            entityName: "ApplicationUser",
            entityId: user.Id
        );

        return true;
    }
}
