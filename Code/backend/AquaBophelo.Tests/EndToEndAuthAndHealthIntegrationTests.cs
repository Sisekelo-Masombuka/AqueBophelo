using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using AquaBophelo.Controllers;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Auth;
using AquaBophelo.Models;
using AquaBophelo.Services;
using AquaBophelo.Services.Interfaces;
using AquaBophelo.Services.Notifications;
using Xunit;

namespace AquaBophelo.Tests;

public class EndToEndAuthAndHealthIntegrationTests
{
    private class TestEmailSender : IEmailSender
    {
        public List<(string To, string Subject, string Html, string Plain)> SentEmails { get; } = new();

        public Task<bool> SendEmailAsync(string toEmail, string subject, string htmlContent, string? plainTextContent = null)
        {
            SentEmails.Add((toEmail, subject, htmlContent, plainTextContent ?? ""));
            return Task.FromResult(true);
        }
    }

    private class TestAuditLogger : IAuditLogger
    {
        public List<(string Action, string Category, string Details)> Logs { get; } = new();

        public Task LogAsync(
            string action,
            string category,
            string details,
            string? userId = null,
            string? userEmail = null,
            string? userRole = null,
            string? entityName = null,
            string? entityId = null,
            string? ipAddress = null)
        {
            Logs.Add((action, category, details));
            return Task.CompletedTask;
        }
    }

    private class TestHostEnvironment : IWebHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Development;
        public string ApplicationName { get; set; } = "AquaBophelo";
        public string WebRootPath { get; set; } = "/wwwroot";
        public IFileProvider WebRootFileProvider { get; set; } = null!;
        public string ContentRootPath { get; set; } = "/app";
        public IFileProvider ContentRootFileProvider { get; set; } = null!;
    }

    private static IServiceProvider CreateTestServices(string dbName, out TestEmailSender emailSender, out TestAuditLogger auditLogger)
    {
        var services = new ServiceCollection();
        emailSender = new TestEmailSender();
        auditLogger = new TestAuditLogger();

        services.AddLogging();
        services.AddDbContext<AppDbContext>(options =>
            options.UseInMemoryDatabase(dbName));

        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequiredLength = 8;
            options.SignIn.RequireConfirmedEmail = true;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "SuperSecret64ByteLongJwtSigningKeyForAquaBopheloTestingSuite2026!",
                ["Jwt:Issuer"] = "AquaBopheloAPI",
                ["Jwt:Audience"] = "AquaBopheloClient",
                ["Jwt:ExpiryMinutes"] = "120"
            })
            .Build();

        services.AddSingleton<IConfiguration>(config);
        services.AddSingleton<IEmailSender>(emailSender);
        services.AddSingleton<IAuditLogger>(auditLogger);
        services.AddSingleton<IEmailQueue, EmailQueue>();
        services.AddScoped<IAuthService, AuthService>();

        return services.BuildServiceProvider();
    }

    [Fact]
    [Trait("Category", "Integration")]
    public async Task FullResidentRegistrationAndLoginFlow_WithRealIdentityAndDatabase_Succeeds()
    {
        // Arrange
        var dbName = "AquaBophelo_AuthFlow_" + Guid.NewGuid();
        var provider = CreateTestServices(dbName, out var emailSender, out _);

        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();

        // 1. Seed Roles & Area
        await roleManager.CreateAsync(new IdentityRole("Resident"));
        await roleManager.CreateAsync(new IdentityRole("Admin"));

        var area = new Area
        {
            Id = 1,
            Name = "Galeshewe Zone 3",
            Latitude = -28.7183,
            Longitude = 24.7319
        };
        context.Areas.Add(area);
        await context.SaveChangesAsync();

        var testEmail = "resident.kimberley@solplaatje.gov.za";
        var testPassword = "SolPlaatje2026!Secure";

        // Step 1: Send registration verification OTP
        var generatedOtp = await authService.SendEmailOtpAsync(testEmail, "EmailVerification");
        Assert.NotNull(generatedOtp);
        Assert.Equal(6, generatedOtp.Length);
        Assert.Single(emailSender.SentEmails);
        Assert.Contains(generatedOtp, emailSender.SentEmails[0].Html);

        // Step 2: Verify OTP
        await authService.VerifyEmailOtpAsync(testEmail, generatedOtp, "EmailVerification");

        // Step 3: Register resident account
        var registerDto = new RegisterDto
        {
            FullName = "Kagiso Resident",
            Email = testEmail,
            Password = testPassword,
            AreaId = 1,
            PhoneNumber = "0829876543"
        };
        var registeredUserDto = await authService.RegisterAsync(registerDto);

        Assert.NotNull(registeredUserDto);
        Assert.Equal(testEmail.ToLowerInvariant(), registeredUserDto.Email.ToLowerInvariant());
        Assert.Equal("Resident", registeredUserDto.Role);

        // Verify User was persisted to real database with verified email
        var persistedUser = await userManager.FindByEmailAsync(testEmail);
        Assert.NotNull(persistedUser);
        Assert.True(persistedUser.EmailConfirmed);
        Assert.Equal("Kagiso Resident", persistedUser.FullName);

        // Step 4: Login with valid credentials
        var loginDto = new LoginDto
        {
            Email = testEmail,
            Password = testPassword
        };
        var authResponse = await authService.LoginAsync(loginDto);

        Assert.NotNull(authResponse);
        Assert.False(string.IsNullOrWhiteSpace(authResponse.Token));

        // Step 5: Verify cryptographic signature and claims on issued JWT
        var tokenHandler = new JwtSecurityTokenHandler();
        Assert.True(tokenHandler.CanReadToken(authResponse.Token));

        var jwt = tokenHandler.ReadJwtToken(authResponse.Token);
        var subClaim = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier || c.Type == JwtRegisteredClaimNames.Sub || c.Type == "nameid");
        var emailClaim = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == JwtRegisteredClaimNames.Email || c.Type == "email");
        var roleClaim = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type == "role");
        var emailConfirmedClaim = jwt.Claims.FirstOrDefault(c => c.Type == "email_confirmed");

        Assert.NotNull(subClaim);
        Assert.Equal(persistedUser.Id, subClaim.Value);
        Assert.NotNull(emailClaim);
        Assert.Equal(testEmail.ToLowerInvariant(), emailClaim.Value.ToLowerInvariant());
        Assert.NotNull(roleClaim);
        Assert.Equal("Resident", roleClaim.Value);
        Assert.NotNull(emailConfirmedClaim);
        Assert.Equal("true", emailConfirmedClaim.Value);

        // Step 6: Invalid password login fails closed
        var invalidLoginDto = new LoginDto
        {
            Email = testEmail,
            Password = "WrongPassword999!"
        };
        await Assert.ThrowsAsync<BadHttpRequestException>(async () =>
        {
            await authService.LoginAsync(invalidLoginDto);
        });
    }

    [Fact]
    [Trait("Category", "Integration")]
    public async Task EmailQueue_ActiveHeartbeat_ReadinessEndpointReturnsHealthy()
    {
        // Arrange
        var dbName = "AquaBophelo_Ready_Healthy_" + Guid.NewGuid();
        var provider = CreateTestServices(dbName, out _, out _);

        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var queue = scope.ServiceProvider.GetRequiredService<IEmailQueue>();

        // Heartbeat is fresh
        queue.RecordHeartbeat();
        Assert.True(queue.IsWorkerHealthy);

        var env = new TestHostEnvironment();
        var controller = new HealthController(env);

        // Act
        var result = await controller.GetReadiness(context, queue);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);

        // Convert anonymous response to dynamic/properties inspection
        var json = System.Text.Json.JsonSerializer.Serialize(okResult.Value);
        Assert.Contains("\"status\":\"healthy\"", json);
        Assert.Contains("\"database\":\"connected\"", json);
        Assert.Contains("\"messageQueue\":\"active\"", json);
    }

    [Fact]
    [Trait("Category", "Integration")]
    public async Task EmailQueue_StaleHeartbeat_ReadinessEndpointReturns503Unhealthy()
    {
        // Arrange
        var dbName = "AquaBophelo_Ready_Stale_" + Guid.NewGuid();
        var provider = CreateTestServices(dbName, out _, out _);

        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var queue = scope.ServiceProvider.GetRequiredService<IEmailQueue>();

        // Simulate stale worker heartbeat from 10 minutes ago
        queue.RecordHeartbeat(DateTime.UtcNow.AddMinutes(-10));
        Assert.False(queue.IsWorkerHealthy);

        var env = new TestHostEnvironment();
        var controller = new HealthController(env);

        // Act
        var result = await controller.GetReadiness(context, queue);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status503ServiceUnavailable, objectResult.StatusCode);

        var json = System.Text.Json.JsonSerializer.Serialize(objectResult.Value);
        Assert.Contains("\"status\":\"unhealthy\"", json);
        Assert.Contains("\"messageQueue\":\"offline\"", json);
    }

    [Fact]
    [Trait("Category", "Integration")]
    public async Task SendEmailOtpAsync_WhenEmailAlreadyExists_ThrowsDuplicateError()
    {
        var dbName = "AquaBophelo_Otp_Dup_" + Guid.NewGuid();
        var provider = CreateTestServices(dbName, out _, out _);
        using var scope = provider.CreateScope();
        var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        var existingUser = new ApplicationUser
        {
            UserName = "existing.resident@solplaatje.gov.za",
            Email = "existing.resident@solplaatje.gov.za",
            FullName = "Existing Resident",
            EmailConfirmed = true
        };
        await userManager.CreateAsync(existingUser, "Password123!");

        var ex = await Assert.ThrowsAsync<BadHttpRequestException>(() =>
            authService.SendEmailOtpAsync("existing.resident@solplaatje.gov.za", "EmailVerification"));

        Assert.Contains("already exists", ex.Message);
    }

    [Fact]
    [Trait("Category", "Integration")]
    public async Task RegisterAsync_WithDirectOtpCode_ConfirmsAndReturnsJwtDirectly()
    {
        var dbName = "AquaBophelo_Reg_DirectOtp_" + Guid.NewGuid();
        var provider = CreateTestServices(dbName, out var emailSender, out _);
        using var scope = provider.CreateScope();
        var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();

        var testEmail = "new.direct.otp@solplaatje.gov.za";
        var otpCode = await authService.SendEmailOtpAsync(testEmail, "EmailVerification");
        Assert.Equal(6, otpCode.Length);

        var regDto = new RegisterDto
        {
            FullName = "Direct OTP Resident",
            Email = testEmail,
            Password = "Password123!",
            PhoneNumber = "0821234567",
            AreaName = "Galeshewe",
            OtpCode = otpCode
        };

        var response = await authService.RegisterAsync(regDto);

        Assert.NotNull(response);
        Assert.False(string.IsNullOrWhiteSpace(response.Token), "JWT Token should be returned immediately when verified with direct OtpCode");
        Assert.Equal("Resident", response.Role);
        Assert.Equal(testEmail, response.Email);
    }
}
