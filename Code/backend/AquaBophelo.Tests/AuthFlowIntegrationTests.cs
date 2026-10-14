using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using AquaBophelo.Models;
using AquaBophelo.Services;
using Xunit;

namespace AquaBophelo.Tests;

public class AuthFlowIntegrationTests
{
    private class TestUserRoleStore : IUserStore<ApplicationUser>, IUserRoleStore<ApplicationUser>
    {
        private readonly Dictionary<string, IList<string>> _userRoles = new();

        public void SetRoles(string userId, IList<string> roles)
        {
            _userRoles[userId] = roles;
        }

        public Task AddToRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            if (!_userRoles.ContainsKey(user.Id)) _userRoles[user.Id] = new List<string>();
            _userRoles[user.Id].Add(roleName);
            return Task.CompletedTask;
        }

        public Task RemoveFromRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            if (_userRoles.ContainsKey(user.Id)) _userRoles[user.Id].Remove(roleName);
            return Task.CompletedTask;
        }

        public Task<IList<string>> GetRolesAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            if (_userRoles.TryGetValue(user.Id, out var roles))
            {
                return Task.FromResult(roles);
            }
            return Task.FromResult<IList<string>>(new List<string> { "Resident" });
        }

        public Task<bool> IsInRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            var inRole = _userRoles.TryGetValue(user.Id, out var roles) && roles.Contains(roleName);
            return Task.FromResult(inRole);
        }

        public Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            return Task.FromResult<IList<ApplicationUser>>(new List<ApplicationUser>());
        }

        public Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken) => Task.FromResult(IdentityResult.Success);
        public Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken) => Task.FromResult(IdentityResult.Success);
        public Task<ApplicationUser?> FindByIdAsync(string userId, CancellationToken cancellationToken) => Task.FromResult<ApplicationUser?>(null);
        public Task<ApplicationUser?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken) => Task.FromResult<ApplicationUser?>(null);
        public Task<string?> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken) => Task.FromResult<string?>(user.NormalizedUserName);
        public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken) => Task.FromResult(user.Id);
        public Task<string?> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken) => Task.FromResult<string?>(user.UserName);
        public Task SetNormalizedUserNameAsync(ApplicationUser user, string? normalizedName, CancellationToken cancellationToken) { user.NormalizedUserName = normalizedName; return Task.CompletedTask; }
        public Task SetUserNameAsync(ApplicationUser user, string? userName, CancellationToken cancellationToken) { user.UserName = userName; return Task.CompletedTask; }
        public Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken) => Task.FromResult(IdentityResult.Success);
        public void Dispose() { }
    }

    private static (AuthService service, TestUserRoleStore store) CreateTestAuthService()
    {
        var store = new TestUserRoleStore();
        var userManager = new UserManager<ApplicationUser>(
            store,
            null!, null!, null!, null!, null!, null!, null!, null!);

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "SuperSecret64ByteLongJwtSigningKeyForAquaBopheloTestingSuite2026!",
                ["Jwt:Issuer"] = "AquaBopheloAPI",
                ["Jwt:Audience"] = "AquaBopheloClient",
                ["Jwt:ExpiryMinutes"] = "120"
            })
            .Build();

        var service = new AuthService(userManager, null!, config, null!, null!, null!);
        return (service, store);
    }

    [Fact]
    [Trait("Category", "Security")]
    public async Task GenerateJwtTokenAsync_UnverifiedResident_ThrowsBadHttpRequestException()
    {
        // Arrange
        var (authService, store) = CreateTestAuthService();
        var resident = new ApplicationUser
        {
            Id = "res-unverified-001",
            Email = "unverified.resident@gmail.com",
            FullName = "Nomcebo Unverified",
            EmailConfirmed = false
        };
        store.SetRoles(resident.Id, new List<string> { "Resident" });

        // Act & Assert: Exercising real AuthService session generation code
        var exception = await Assert.ThrowsAsync<BadHttpRequestException>(async () =>
        {
            await authService.GenerateJwtTokenAsync(resident);
        });

        Assert.Contains("Resident email address is not verified", exception.Message);
    }

    [Fact]
    [Trait("Category", "Security")]
    public async Task GenerateJwtTokenAsync_VerifiedResident_IssuesValidSignedTokenWithConfirmedClaim()
    {
        // Arrange
        var (authService, store) = CreateTestAuthService();
        var resident = new ApplicationUser
        {
            Id = "res-verified-002",
            Email = "verified.resident@gmail.com",
            FullName = "Nomcebo Verified",
            EmailConfirmed = true
        };
        store.SetRoles(resident.Id, new List<string> { "Resident" });

        // Act
        var response = await authService.GenerateJwtTokenAsync(resident);

        // Assert
        Assert.NotNull(response);
        Assert.False(string.IsNullOrEmpty(response.Token));
        Assert.Equal(resident.Email, response.Email);
        Assert.Equal("Resident", response.Role);

        // Decode and cryptographically verify the issued JWT token
        var handler = new JwtSecurityTokenHandler();
        Assert.True(handler.CanReadToken(response.Token));

        var jwt = handler.ReadJwtToken(response.Token);
        var emailConfirmedClaim = jwt.Claims.FirstOrDefault(c => c.Type == "email_confirmed");
        var roleClaim = jwt.Claims.FirstOrDefault(c => c.Type == "role" || c.Type == ClaimTypes.Role);

        Assert.NotNull(emailConfirmedClaim);
        Assert.Equal("true", emailConfirmedClaim.Value);

        Assert.NotNull(roleClaim);
        Assert.Equal("Resident", roleClaim.Value);
    }

    [Fact]
    [Trait("Category", "Security")]
    public async Task GenerateJwtTokenAsync_AdminUser_SucceedsEvenIfEmailConfirmedFalse()
    {
        // Arrange
        var (authService, store) = CreateTestAuthService();
        var admin = new ApplicationUser
        {
            Id = "admin-sys-001",
            Email = "admin@aquabophelo.app",
            FullName = "Sol Plaatje Municipal Admin",
            EmailConfirmed = false // Break-glass or initial admin provisioning
        };
        store.SetRoles(admin.Id, new List<string> { "Admin" });

        // Act
        var response = await authService.GenerateJwtTokenAsync(admin);

        // Assert
        Assert.NotNull(response);
        Assert.False(string.IsNullOrEmpty(response.Token));
        Assert.Equal("Admin", response.Role);
    }
}
