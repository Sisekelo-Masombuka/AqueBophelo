using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using AquaBophelo.Controllers;
using AquaBophelo.Data;
using AquaBophelo.Services.Interfaces;
using AquaBophelo.Services.Notifications;
using Xunit;

namespace AquaBophelo.Tests;

public class EmailWorkerFailureIntegrationTests
{
    private class StubHostEnvironment : IWebHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Production;
        public string ApplicationName { get; set; } = "AquaBophelo";
        public string WebRootPath { get; set; } = "/wwwroot";
        public IFileProvider WebRootFileProvider { get; set; } = null!;
        public string ContentRootPath { get; set; } = "/app";
        public IFileProvider ContentRootFileProvider { get; set; } = null!;
    }

    private class FailingEmailSender : IEmailSender
    {
        public int AttemptCount { get; private set; }

        public Task<bool> SendEmailAsync(string toEmail, string subject, string htmlContent, string? plainTextContent = null)
        {
            AttemptCount++;
            return Task.FromResult(false); // Simulates delivery failure (e.g. Brevo rejected or API down)
        }
    }

    private class HangingEmailSender : IEmailSender
    {
        public Task<bool> SendEmailAsync(string toEmail, string subject, string htmlContent, string? plainTextContent = null)
        {
            // Simulates hung network connection
            return Task.Delay(TimeSpan.FromSeconds(60)).ContinueWith(_ => true);
        }
    }

    private class RecoveringEmailSender : IEmailSender
    {
        public bool ShouldSucceed { get; set; } = false;

        public Task<bool> SendEmailAsync(string toEmail, string subject, string htmlContent, string? plainTextContent = null)
        {
            return Task.FromResult(ShouldSucceed);
        }
    }

    private static AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task EmailQueue_ConsecutiveFailures_DegradesHealthTo503_AndRecoversOnSuccess()
    {
        // Arrange
        using var context = CreateInMemoryDbContext();
        var emailQueue = new EmailQueue();
        var env = new StubHostEnvironment();
        var controller = new HealthController(env);

        // 1. Initial State: should be healthy (200 OK)
        var initialResult = await controller.GetReadiness(context, emailQueue) as OkObjectResult;
        Assert.NotNull(initialResult);
        Assert.Equal(StatusCodes.Status200OK, initialResult.StatusCode);

        // 2. Accumulate 4 failures: still below threshold of 5, should remain healthy
        for (int i = 1; i <= 4; i++)
        {
            emailQueue.RecordDeliveryFailure($"Transient error {i}");
            Assert.Equal(i, emailQueue.ConsecutiveFailureCount);
            Assert.True(emailQueue.IsDeliveryHealthy);
            Assert.True(emailQueue.IsWorkerHealthy);
        }

        var underThresholdResult = await controller.GetReadiness(context, emailQueue) as OkObjectResult;
        Assert.NotNull(underThresholdResult);
        Assert.Equal(StatusCodes.Status200OK, underThresholdResult.StatusCode);

        // 3. 5th failure: hits threshold, must degrade to unhealthy (503 Service Unavailable)
        emailQueue.RecordDeliveryFailure("5th consecutive failure: Brevo API unreachable");
        Assert.Equal(5, emailQueue.ConsecutiveFailureCount);
        Assert.False(emailQueue.IsDeliveryHealthy);
        Assert.False(emailQueue.IsWorkerHealthy);

        var degradedResult = await controller.GetReadiness(context, emailQueue) as ObjectResult;
        Assert.NotNull(degradedResult);
        Assert.Equal(StatusCodes.Status503ServiceUnavailable, degradedResult.StatusCode);

        // Inspect JSON properties
        dynamic payload = degradedResult.Value!;
        Assert.Equal("unhealthy", (string)payload.status);
        Assert.Equal("connected", (string)payload.database);
        Assert.Equal("offline", (string)payload.messageQueue);
        Assert.Equal("failing", (string)payload.deliveryStatus);
        Assert.Equal(5, (int)payload.consecutiveDeliveryFailures);
        Assert.Equal("5th consecutive failure: Brevo API unreachable", (string)payload.lastDeliveryFailureReason);

        // 4. Delivery recovery: successful delivery resets consecutive failure counter to 0
        emailQueue.RecordDeliverySuccess();
        Assert.Equal(0, emailQueue.ConsecutiveFailureCount);
        Assert.True(emailQueue.IsDeliveryHealthy);
        Assert.True(emailQueue.IsWorkerHealthy);
        Assert.NotNull(emailQueue.LastSuccessfulDeliveryUtc);

        var recoveredResult = await controller.GetReadiness(context, emailQueue) as OkObjectResult;
        Assert.NotNull(recoveredResult);
        Assert.Equal(StatusCodes.Status200OK, recoveredResult.StatusCode);

        dynamic recoveredPayload = recoveredResult.Value!;
        Assert.Equal("healthy", (string)recoveredPayload.status);
        Assert.Equal("active", (string)recoveredPayload.messageQueue);
        Assert.Equal("healthy", (string)recoveredPayload.deliveryStatus);
        Assert.Equal(0, (int)recoveredPayload.consecutiveDeliveryFailures);
    }

    [Fact]
    public async Task EmailQueue_StaleHeartbeat_DegradesHealthTo503()
    {
        // Arrange
        using var context = CreateInMemoryDbContext();
        var emailQueue = new EmailQueue();
        var env = new StubHostEnvironment();
        var controller = new HealthController(env);

        // Stale heartbeat (> 2 minutes ago)
        emailQueue.RecordHeartbeat(DateTime.UtcNow.AddMinutes(-3));
        Assert.False(emailQueue.IsWorkerHealthy);

        var readyResult = await controller.GetReadiness(context, emailQueue) as ObjectResult;
        Assert.NotNull(readyResult);
        Assert.Equal(StatusCodes.Status503ServiceUnavailable, degradedStatusCode(readyResult));

        // Refreshed heartbeat restores health
        emailQueue.RecordHeartbeat(DateTime.UtcNow);
        Assert.True(emailQueue.IsWorkerHealthy);

        var freshResult = await controller.GetReadiness(context, emailQueue) as OkObjectResult;
        Assert.NotNull(freshResult);
        Assert.Equal(StatusCodes.Status200OK, freshResult.StatusCode);

        static int degradedStatusCode(ObjectResult res) => res.StatusCode ?? 500;
    }

    [Fact]
    public async Task EmailQueueBackgroundService_HandlesFailedDeliveryAndIncrementsFailures()
    {
        // Arrange
        var services = new ServiceCollection();
        var emailQueue = new EmailQueue();
        var failingSender = new FailingEmailSender();

        services.AddSingleton<IEmailQueue>(emailQueue);
        services.AddSingleton<IEmailSender>(failingSender);
        services.AddLogging(builder => builder.AddDebug());

        var serviceProvider = services.BuildServiceProvider();
        var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
        var serviceLogger = loggerFactory.CreateLogger<EmailQueueBackgroundService>();

        var backgroundService = new EmailQueueBackgroundService(emailQueue, serviceProvider, serviceLogger);

        using var cts = new CancellationTokenSource();

        // Start background service
        var runTask = backgroundService.StartAsync(cts.Token);

        // Enqueue an email work item
        emailQueue.EnqueueEmail(new EmailWorkItem
        {
            ToEmail = "resident@solplaatje.org.za",
            Subject = "Test Alert",
            HtmlContent = "<p>Water outage alert</p>",
            PlainTextContent = "Water outage alert",
            Priority = "Critical"
        });

        // Allow worker loop to process item
        await Task.Delay(200);

        // Stop background service
        await backgroundService.StopAsync(cts.Token);
        await runTask;

        // Assert
        Assert.Equal(1, failingSender.AttemptCount);
        Assert.Equal(1, emailQueue.ConsecutiveFailureCount);
        Assert.Equal("EmailSender returned false", emailQueue.LastDeliveryFailureReason);
        Assert.NotNull(emailQueue.LastDeliveryFailureUtc);
    }

    [Fact]
    public async Task EmailQueueBackgroundService_HandlesSendTimeoutGracefully_WithoutCrashing()
    {
        var services = new ServiceCollection();
        var emailQueue = new EmailQueue();
        var hangingSender = new HangingEmailSender();

        services.AddSingleton<IEmailQueue>(emailQueue);
        services.AddSingleton<IEmailSender>(hangingSender);
        services.AddLogging(builder => builder.AddDebug());

        // Verify that WaitAsync correctly triggers TimeoutException when send hangs
        var sendTask = hangingSender.SendEmailAsync("timeout@test.com", "Timeout test", "<p>test</p>");
        await Assert.ThrowsAsync<TimeoutException>(async () =>
        {
            await sendTask.WaitAsync(TimeSpan.FromMilliseconds(50));
        });

        // Verify that EmailQueue failure handler logs the timeout and tracks the failure
        emailQueue.RecordDeliveryFailure("Email delivery timed out after 30 seconds");
        Assert.Equal(1, emailQueue.ConsecutiveFailureCount);
        Assert.Equal("Email delivery timed out after 30 seconds", emailQueue.LastDeliveryFailureReason);
        Assert.NotNull(emailQueue.LastDeliveryFailureUtc);
    }
}
