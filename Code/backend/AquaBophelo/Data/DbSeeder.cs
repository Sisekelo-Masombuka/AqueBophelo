using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Models;

namespace AquaBophelo.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // 1. Seed Identity Roles
        string[] roles = { "Admin", "Driver", "Resident" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2. Seed Sol Plaatje Municipal Areas
        if (!await context.Areas.AnyAsync())
        {
            var areas = new List<Area>
            {
                new Area { Name = "Galeshewe", Latitude = -28.7183, Longitude = 24.7319 },
                new Area { Name = "Kimberley Central", Latitude = -28.7419, Longitude = 24.7719 },
                new Area { Name = "Roodepan", Latitude = -28.6921, Longitude = 24.7088 },
            };

            await context.Areas.AddRangeAsync(areas);
            await context.SaveChangesAsync();
        }

        var defaultArea = await context.Areas.FirstOrDefaultAsync(a => a.Name == "Kimberley Central") ?? await context.Areas.FirstOrDefaultAsync();

        // 3. Seed Reservoirs & Dams
        if (!await context.Dams.AnyAsync())
        {
            var dams = new List<Dam>
            {
                new Dam
                {
                    Name = "Newton Reservoir",
                    Latitude = -28.7511,
                    Longitude = 24.7612,
                    CapacityMegaLitres = 92.5,
                    IsActive = true,
                    AreaId = defaultArea?.Id
                },
                new Dam
                {
                    Name = "Riverton Water Works",
                    Latitude = -28.5369,
                    Longitude = 24.7061,
                    CapacityMegaLitres = 150.0,
                    IsActive = true,
                    AreaId = defaultArea?.Id
                }
            };

            await context.Dams.AddRangeAsync(dams);
            await context.SaveChangesAsync();

            var newton = dams.First(d => d.Name == "Newton Reservoir");
            var riverton = dams.First(d => d.Name == "Riverton Water Works");

            context.DamReadings.AddRange(
                new DamReading
                {
                    DamId = newton.Id,
                    LevelPercent = 62.5,
                    VolumeMegaLitres = 57.8,
                    RecordedAt = DateTime.UtcNow,
                    Source = "Manual"
                },
                new DamReading
                {
                    DamId = riverton.Id,
                    LevelPercent = 82.0,
                    VolumeMegaLitres = 123.0,
                    RecordedAt = DateTime.UtcNow,
                    Source = "Manual"
                }
            );

            await context.SaveChangesAsync();
        }

        // Helper to seed or update demo users
        async Task SeedUser(string email, string fullName, string role, string primaryPassword)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    FullName = fullName,
                    AreaId = defaultArea?.Id
                };

                var createRes = await userManager.CreateAsync(user, primaryPassword);
                if (createRes.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role);
                }
            }
            else
            {
                // User already exists: preserve their password, ensure their required role is assigned
                if (!await userManager.IsInRoleAsync(user, role))
                {
                    await userManager.AddToRoleAsync(user, role);
                }
            }
        }

        // 4. Seed Master Administrator Account from Protected Configuration
        var configuration = scope.ServiceProvider.GetRequiredService<Microsoft.Extensions.Configuration.IConfiguration>();
        var hostEnvironment = scope.ServiceProvider.GetRequiredService<Microsoft.Extensions.Hosting.IHostEnvironment>();
        var logger = scope.ServiceProvider.GetService<ILoggerFactory>()?.CreateLogger("DbSeeder");

        var adminEmail = configuration["Admin:Email"] ?? configuration["ADMIN_EMAIL"] ?? "admin@aquabophelo.app";
        var adminPassword = configuration["Admin:InitialPassword"] ?? configuration["ADMIN_INITIAL_PASSWORD"];

        // In local development only, dynamically generate a temporary random password if unset
        if (string.IsNullOrWhiteSpace(adminPassword) && hostEnvironment.IsDevelopment())
        {
            adminPassword = $"DevAdmin!{Guid.NewGuid().ToString("N")[..8]}#";
            logger?.LogInformation("[DbSeeder] ADMIN_INITIAL_PASSWORD not set. Generated temporary dev admin account for local development.");
        }

        if (!string.IsNullOrWhiteSpace(adminPassword))
        {
            await SeedUser(adminEmail, "Sol Plaatje Municipal Admin", "Admin", adminPassword);
        }
        else
        {
            logger?.LogInformation("[DbSeeder] Notice: 'ADMIN_INITIAL_PASSWORD' environment variable is not configured. Skipping automatic admin provisioning in production.");
        }

        // 5. Destructive Demo Data Cleanup (STRICT SAFETY GATE: strictly isolated to local development with explicit PURGE_DEMO_DATA=true flag)
        // Never executed automatically in production or during normal reference data seeding.
        var shouldPurgeDemo = hostEnvironment.IsDevelopment() && configuration.GetValue<bool>("PURGE_DEMO_DATA", false);
        if (shouldPurgeDemo)
        {
            await PurgeLegacyDemoDataAsync(context, userManager);
        }

        // 5. Seed Delivery Routes (Base corridors for Sol Plaatje)
        if (!await context.Routes.AnyAsync())
        {
            var galesheweArea = await context.Areas.FirstOrDefaultAsync(a => a.Name == "Galeshewe") ?? defaultArea;
            var sampleRoute = new TruckRoute
            {
                Name = "Galeshewe Zone 3 Morning Route",
                AreaId = galesheweArea?.Id,
                Stops = new List<RouteStop>
                {
                    new RouteStop
                    {
                        Name = "Galeshewe Community Hall",
                        Latitude = -28.7150,
                        Longitude = 24.7280,
                        Sequence = 1
                    },
                    new RouteStop
                    {
                        Name = "Kagisho Clinic Water Point",
                        Latitude = -28.7210,
                        Longitude = 24.7350,
                        Sequence = 2
                    },
                    new RouteStop
                    {
                        Name = "Mayibuye Primary School",
                        Latitude = -28.7280,
                        Longitude = 24.7410,
                        Sequence = 3
                    }
                }
            };

            context.Routes.Add(sampleRoute);
            await context.SaveChangesAsync();
        }

        // 6. Seed Water Tanker Fleet (Available for dispatch, unassigned)
        if (!await context.Trucks.AnyAsync())
        {
            var trucks = new List<Truck>
            {
                new Truck
                {
                    RegistrationNumber = "542-KM NC",
                    CapacityLitres = 10000,
                    Status = "Available",
                    DriverId = null,
                    LastLatitude = -28.7183,
                    LastLongitude = 24.7319,
                    LastSeenAt = DateTime.UtcNow
                },
                new Truck
                {
                    RegistrationNumber = "882-KM NC",
                    CapacityLitres = 15000,
                    Status = "Available",
                    DriverId = null,
                    LastLatitude = -28.7419,
                    LastLongitude = 24.7719,
                    LastSeenAt = DateTime.UtcNow
                },
                new Truck
                {
                    RegistrationNumber = "104-KM NC",
                    CapacityLitres = 10000,
                    Status = "Available",
                    DriverId = null,
                    LastLatitude = -28.6921,
                    LastLongitude = 24.7088,
                    LastSeenAt = DateTime.UtcNow
                }
            };

            await context.Trucks.AddRangeAsync(trucks);
            await context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Destructive cleanup helper strictly for local development environments when PURGE_DEMO_DATA=true is explicitly set.
    /// Never called in production or during normal reference data seeding.
    /// </summary>
    private static async Task PurgeLegacyDemoDataAsync(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        string[] testEmailsToPurge = { "admin@aquabophelo.gov.za", "nomcebo.resident@gmail.com", "resident@aquabophelo.gov.za", "driver@aquabophelo.gov.za", "sipho.driver@aquabophelo.gov.za" };
        foreach (var testEmail in testEmailsToPurge)
        {
            var testUser = await userManager.FindByEmailAsync(testEmail);
            if (testUser != null)
            {
                try
                {
                    // 1. Unlink trucks
                    var userTrucks = await context.Trucks.Where(t => t.DriverId == testUser.Id).ToListAsync();
                    foreach (var ut in userTrucks) { ut.DriverId = null; }

                    // 2. Remove Trips associated with this driver
                    var userTrips = await context.Trips.Where(t => t.DriverId == testUser.Id).ToListAsync();
                    if (userTrips.Count > 0)
                    {
                        var tripIds = userTrips.Select(t => t.Id).ToList();
                        var locations = await context.TruckLocations.Where(tl => tl.TripId.HasValue && tripIds.Contains(tl.TripId.Value)).ToListAsync();
                        context.TruckLocations.RemoveRange(locations);
                        context.Trips.RemoveRange(userTrips);
                    }

                    // 3. Remove AlertSubscriptions for this user
                    var userSubs = await context.AlertSubscriptions.Where(s => s.UserId == testUser.Id).ToListAsync();
                    if (userSubs.Count > 0)
                    {
                        context.AlertSubscriptions.RemoveRange(userSubs);
                    }

                    // 4. Remove DeviceTokens for this user
                    var userTokens = await context.DeviceTokens.Where(dt => dt.UserId == testUser.Id).ToListAsync();
                    if (userTokens.Count > 0)
                    {
                        context.DeviceTokens.RemoveRange(userTokens);
                    }

                    await context.SaveChangesAsync();
                    await userManager.DeleteAsync(testUser);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[DbSeeder] Notice purging {testEmail}: {ex.Message}");
                }
            }
        }

        // Purge legacy mock fault tickets if present (#SPM-2026-9812, #SPM-2026-4410)
        var mockReports = await context.IssueReports
            .Where(r => r.TicketId == "#SPM-2026-9812" || r.TicketId == "#SPM-2026-4410" || r.ImageUrl == "/pipe_leak.jpg")
            .ToListAsync();
        if (mockReports.Count > 0)
        {
            context.IssueReports.RemoveRange(mockReports);
            await context.SaveChangesAsync();
        }
    }
}
