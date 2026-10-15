using AquaBophelo.Configuration;
using AquaBophelo.Services.Security;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Xunit;

namespace AquaBophelo.Tests;

public class TurnstileSecurityTests
{
    private class MockHostEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Production;
        public string ApplicationName { get; set; } = "AquaBophelo";
        public string ContentRootPath { get; set; } = "/app";
        public Microsoft.Extensions.FileProviders.IFileProvider ContentRootFileProvider { get; set; } = null!;
    }

    [Fact]
    [Trait("Category", "Security")]
    public async Task VerifyTokenAsync_ProductionMissingSecretKey_FailsClosedAndReturnsFalse()
    {
        // Arrange: Production environment without configured secret key
        var env = new MockHostEnvironment { EnvironmentName = Environments.Production };
        var options = Options.Create(new TurnstileOptions { SecretKey = "" });
        var logger = NullLogger<TurnstileService>.Instance;
        var httpClient = new HttpClient();

        var service = new TurnstileService(httpClient, options, logger, env);

        // Act
        var result = await service.VerifyTokenAsync("any-user-token");

        // Assert: Fail-Closed guarantee
        Assert.False(result);
    }

    [Fact]
    [Trait("Category", "Security")]
    public async Task VerifyTokenAsync_ProductionEmptyToken_ReturnsFalse()
    {
        // Arrange
        var env = new MockHostEnvironment { EnvironmentName = Environments.Production };
        var options = Options.Create(new TurnstileOptions { SecretKey = "0x4AAAAAAAxRealProductionKeySecret" });
        var logger = NullLogger<TurnstileService>.Instance;
        var httpClient = new HttpClient();

        var service = new TurnstileService(httpClient, options, logger, env);

        // Act & Assert
        Assert.False(await service.VerifyTokenAsync(""));
        Assert.False(await service.VerifyTokenAsync("   "));
    }

    [Fact]
    [Trait("Category", "Security")]
    public async Task VerifyTokenAsync_DevelopmentDummyTestToken_ReturnsTrue()
    {
        // Arrange
        var env = new MockHostEnvironment { EnvironmentName = Environments.Development };
        var options = Options.Create(new TurnstileOptions { SecretKey = "" });
        var logger = NullLogger<TurnstileService>.Instance;
        var httpClient = new HttpClient();

        var service = new TurnstileService(httpClient, options, logger, env);

        // Act
        var result = await service.VerifyTokenAsync("1x0000000000000000000000000000000AA");

        // Assert: Allowed only in development/testing
        Assert.True(result);
    }
}
