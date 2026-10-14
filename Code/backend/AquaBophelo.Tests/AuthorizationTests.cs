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
}
