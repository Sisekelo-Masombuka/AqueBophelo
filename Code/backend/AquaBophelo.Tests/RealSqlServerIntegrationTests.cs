using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AquaBophelo.Data;
using AquaBophelo.Models;
using Xunit;
using Xunit.Abstractions;

namespace AquaBophelo.Tests;

/// <summary>
/// Verifies ASP.NET Identity, Entity Framework Core relational mappings, password hashing,
/// foreign key constraints, and OTP persistence against a live Microsoft SQL Server / LocalDB instance.
/// </summary>
public class RealSqlServerIntegrationTests
{
    private readonly ITestOutputHelper _output;

    public RealSqlServerIntegrationTests(ITestOutputHelper output)
    {
        _output = output;
    }

    private static string GetSqlServerConnectionString()
    {
        // 1. Check environment variable override (e.g. CI runner or Azure SQL)
        var envConn = Environment.GetEnvironmentVariable("SQLSERVER_CONNECTION_STRING");
        if (!string.IsNullOrWhiteSpace(envConn)) return envConn;

        // 2. Check localdb instances
        var testDbName = $"AquaBophelo_RealSql_Test_{Guid.NewGuid():N}";
        return $"Server=(localdb)\\AquaBopheloDbInstance;Database={testDbName};Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;Connect Timeout=5";
    }

    private static async Task<bool> IsSqlServerReachableAsync(string connectionString)
    {
        try
        {
            var masterConnBuilder = new Microsoft.Data.SqlClient.SqlConnectionStringBuilder(connectionString)
            {
                InitialCatalog = "master",
                ConnectTimeout = 3
            };

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer(masterConnBuilder.ConnectionString)
                .Options;

            using var context = new AppDbContext(options);
            return await context.Database.CanConnectAsync();
        }
        catch
        {
            return false;
        }
    }

    [Fact]
    public async Task RealSqlServer_EndToEndIdentityAndRelationalPersistenceTest()
    {
        var connectionString = GetSqlServerConnectionString();

        // Check if SQL Server / LocalDB is accessible
        if (!await IsSqlServerReachableAsync(connectionString))
        {
            _output.WriteLine("SQL Server / LocalDB instance not available in this runtime environment. Skipping real SQL Server integration test.");
            return;
        }

        _output.WriteLine($"Connected successfully to real SQL Server. Running integration test against temporary database.");

        var services = new ServiceCollection();
        services.AddLogging(b => b.AddDebug());
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

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

        var serviceProvider = services.BuildServiceProvider();
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        try
        {
            // 1. Create database schema on real SQL Server
            await context.Database.EnsureCreatedAsync();

            // 2. Seed Identity Roles in real SQL Server
            var roleResult = await roleManager.CreateAsync(new IdentityRole("Resident"));
            Assert.True(roleResult.Succeeded);

            var adminRoleResult = await roleManager.CreateAsync(new IdentityRole("Admin"));
            Assert.True(adminRoleResult.Succeeded);

            // 3. Seed an Area entity
            var testArea = new Area
            {
                Name = "Galeshewe Ward 3",
                Latitude = -28.7282,
                Longitude = 24.7299
            };
            context.Areas.Add(testArea);
            await context.SaveChangesAsync();
            Assert.True(testArea.Id > 0);

            // 4. Create ApplicationUser with ASP.NET Identity in real SQL Server
            var testUser = new ApplicationUser
            {
                UserName = "resident.ward3@solplaatje.org.za",
                Email = "resident.ward3@solplaatje.org.za",
                NormalizedEmail = "RESIDENT.WARD3@SOLPLAATJE.ORG.ZA",
                NormalizedUserName = "RESIDENT.WARD3@SOLPLAATJE.ORG.ZA",
                FullName = "Lerato Khumalo",
                PhoneNumber = "+27821112233",
                EmailConfirmed = true,
                AreaId = testArea.Id,
                CreatedAt = DateTime.UtcNow
            };

            var userCreateResult = await userManager.CreateAsync(testUser, "SecurePass123!");
            Assert.True(userCreateResult.Succeeded);
            Assert.NotNull(testUser.Id);

            // Add role to user
            var addRoleResult = await userManager.AddToRoleAsync(testUser, "Resident");
            Assert.True(addRoleResult.Succeeded);

            // 5. Test Password Verification against SQL Server stored hash
            var passwordValid = await userManager.CheckPasswordAsync(testUser, "SecurePass123!");
            Assert.True(passwordValid);

            var wrongPasswordValid = await userManager.CheckPasswordAsync(testUser, "WrongPassword!");
            Assert.False(wrongPasswordValid);

            // 6. Test relational query and foreign key join against SQL Server
            var userFromDb = await context.Users
                .Include(u => u.Area)
                .FirstOrDefaultAsync(u => u.Email == "resident.ward3@solplaatje.org.za");

            Assert.NotNull(userFromDb);
            Assert.Equal("Lerato Khumalo", userFromDb.FullName);
            Assert.NotNull(userFromDb.Area);
            Assert.Equal("Galeshewe Ward 3", userFromDb.Area.Name);

            // 7. Test EmailOtp persistence in real SQL Server
            var otpRecord = new EmailOtp
            {
                Email = "resident.ward3@solplaatje.org.za",
                CodeHash = "hashed-otp-code-for-testing",
                Purpose = "Registration",
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                CreatedAt = DateTime.UtcNow,
                IsUsed = false,
                AttemptCount = 1
            };
            context.EmailOtps.Add(otpRecord);
            await context.SaveChangesAsync();
            Assert.True(otpRecord.Id > 0);

            // Retrieve and update OTP record
            var retrievedOtp = await context.EmailOtps
                .FirstOrDefaultAsync(o => o.Email == "resident.ward3@solplaatje.org.za" && !o.IsUsed);
            Assert.NotNull(retrievedOtp);

            retrievedOtp.IsUsed = true;
            retrievedOtp.AttemptCount += 1;
            await context.SaveChangesAsync();

            var updatedOtp = await context.EmailOtps.FindAsync(otpRecord.Id);
            Assert.NotNull(updatedOtp);
            Assert.True(updatedOtp.IsUsed);
            Assert.Equal(2, updatedOtp.AttemptCount);

            _output.WriteLine("Real SQL Server integration test passed successfully!");
        }
        finally
        {
            // Clean up the temporary test database
            try
            {
                await context.Database.EnsureDeletedAsync();
                _output.WriteLine("Cleaned up temporary SQL Server test database.");
            }
            catch (Exception ex)
            {
                _output.WriteLine($"Non-fatal notice during test DB cleanup: {ex.Message}");
            }
        }
    }
}
