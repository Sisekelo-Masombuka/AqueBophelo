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

    public AuthService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        AppDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _context = context;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            throw new BadHttpRequestException("User with this email already exists.");
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            AreaId = dto.AreaId,
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
            AreaName = user.Area?.Name
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
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, primaryRole)
        };

        var jwtKey = _configuration["Jwt:Key"] ?? "AquaBopheloSecretSecurityKey2026SolPlaatjeSuperSecretKey!";
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "AquaBopheloAPI";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "AquaBopheloClient";
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
            ExpiresAt = expiresAt,
            Message = "Authentication successful"
        };
    }
}
