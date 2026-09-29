using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Auth;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        AppDbContext context,
        INotificationService notificationService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _context = context;
        _notificationService = notificationService;
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
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadHttpRequestException($"Registration failed: {errors}");
        }

        // Public registration assigns "Resident" role by default
        if (!await _roleManager.RoleExistsAsync("Resident"))
        {
            await _roleManager.CreateAsync(new IdentityRole("Resident"));
        }
        await _userManager.AddToRoleAsync(user, "Resident");

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

        // Attach claims for all assigned roles (e.g. Admin, Driver, Resident)
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

    public async Task<bool> ForgotPasswordAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            // Generic success return to prevent email enumeration
            return true;
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var subject = "AquaBophelo — Password Reset Request";
        var body = $"Sol Plaatje Municipal Water System\n\nDear {user.FullName},\n\nWe received a password reset request for your AquaBophelo account.\nYour Password Reset Token is:\n\n{token}\n\nPlease enter this token on the Reset Password page to create your new password.\nIf you did not request this, please ignore this email.\n\nElke druppel tel • Metsi ke bophelo";

        await _notificationService.SendEmailAsync(email, subject, body);
        return true;
    }

    public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            throw new BadHttpRequestException("Invalid email or reset token.");
        }

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadHttpRequestException($"Password reset failed: {errors}");
        }

        return true;
    }
}
