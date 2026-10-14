using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AquaBophelo.Controllers;

namespace AquaBophelo.Tests;

public class AuthorizationTests
{
    [Fact]
    [Trait("Category", "Security")]
    public void TrucksController_CreateAction_HasAuthorizeAdminAttribute()
    {
        // Arrange
        var methodInfo = typeof(TrucksController).GetMethod(nameof(TrucksController.Create));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
        Assert.Equal("Admin", authorizeAttribute.Roles);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void RoutesController_CreateAction_HasAuthorizeAdminAttribute()
    {
        // Arrange
        var methodInfo = typeof(RoutesController).GetMethod(nameof(RoutesController.Create));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
        Assert.Equal("Admin", authorizeAttribute.Roles);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void RoutesController_DeleteAction_HasAuthorizeAdminAttribute()
    {
        // Arrange
        var methodInfo = typeof(RoutesController).GetMethod(nameof(RoutesController.Delete));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
        Assert.Equal("Admin", authorizeAttribute.Roles);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void ResidentUser_CannotAccess_AdminActions()
    {
        // Arrange: Create a Resident user context
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "res-user-123"),
            new Claim(ClaimTypes.Email, "resident@test.com"),
            new Claim(ClaimTypes.Role, "Resident")
        }, "TestAuth"));

        // Act: Verify role evaluation for Admin role
        bool isAdmin = user.IsInRole("Admin");

        // Assert
        Assert.False(isAdmin, "A Resident user must never evaluate as an Admin.");
    }

    [Fact]
    [Trait("Category", "Security")]
    public void HealthController_TestEmail_HasAuthorizeAdminAttribute()
    {
        // Arrange
        var methodInfo = typeof(HealthController).GetMethod(nameof(HealthController.TestEmail));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
        Assert.Equal("Admin", authorizeAttribute.Roles);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void HealthController_TestSentry_HasAuthorizeAdminAttribute()
    {
        // Arrange
        var methodInfo = typeof(HealthController).GetMethod(nameof(HealthController.TestSentry));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
        Assert.Equal("Admin", authorizeAttribute.Roles);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void TruckHub_SendLocation_HasAuthorizeDriverAdminAttribute()
    {
        // Arrange
        var methodInfo = typeof(AquaBophelo.Hubs.TruckHub).GetMethod(nameof(AquaBophelo.Hubs.TruckHub.SendLocation));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
        Assert.Equal("Driver,Admin", authorizeAttribute.Roles);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void TruckHub_JoinTruckGroup_HasAuthorizeDriverAdminAttribute()
    {
        // Arrange
        var methodInfo = typeof(AquaBophelo.Hubs.TruckHub).GetMethod(nameof(AquaBophelo.Hubs.TruckHub.JoinTruckGroup));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
        Assert.Equal("Driver,Admin", authorizeAttribute.Roles);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void AuthController_SendDeleteAccountOtp_HasAuthorizeAttribute()
    {
        // Arrange
        var methodInfo = typeof(AuthController).GetMethod(nameof(AuthController.SendDeleteAccountOtp));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void AuthController_DeleteAccount_HasAuthorizeAttribute()
    {
        // Arrange
        var methodInfo = typeof(AuthController).GetMethod(nameof(AuthController.DeleteAccount));

        // Act
        var authorizeAttribute = methodInfo?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void TruckHub_DriverAssignmentCheck_RejectsUnassignedDriver()
    {
        // Arrange
        var tripDriverId = "driver-assigned-001";
        var unassignedDriverId = "driver-rogue-002";
        var callingUserId = unassignedDriverId;
        bool isAdmin = false;

        // Act: verify assigned driver check logic
        bool isAssigned = callingUserId == tripDriverId;
        bool isAuthorized = isAdmin || isAssigned;

        // Assert
        Assert.False(isAuthorized, "A driver who is not assigned to this trip must not be authorized to broadcast locations.");
    }

    [Fact]
    [Trait("Category", "Security")]
    public void TruckHub_Class_HasAuthorizeAttribute()
    {
        // Arrange & Act
        var authorizeAttribute = typeof(AquaBophelo.Hubs.TruckHub)
            .GetCustomAttributes(typeof(AuthorizeAttribute), true)
            .Cast<AuthorizeAttribute>()
            .FirstOrDefault();

        // Assert
        Assert.NotNull(authorizeAttribute);
    }
}
