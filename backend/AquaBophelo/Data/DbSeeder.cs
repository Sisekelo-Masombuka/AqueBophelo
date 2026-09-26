using Microsoft.AspNetCore.Identity;
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

        await context.Database.EnsureCreatedAsync();

        // 1. Seed Roles
        string[] roles = new[] { "Admin", "Driver", "Resident" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2. Seed Sol Plaatje Municipal Areas
        if (!context.Areas.Any())
        {
            var areas = new List<Area>
            {
                new Area { Name = "Galeshewe", Latitude = -28.7183, Longitude = 24.7319 },
                new Area { Name = "Kimberley Central", Latitude = -28.7419, Longitude = 24.7719 },
                new Area { Name = "Roodepan", Latitude = -28.6921, Longitude = 24.7088 }
            };
            await context.Areas.AddRangeAsync(areas);
            await context.SaveChangesAsync();
        }

        var defaultArea = context.Areas.FirstOrDefault();

        // 3. Seed Dams
        if (!context.Dams.Any())
        {
            var newtonRes = new Dam
            {
                Name = "Newton Reservoir",
                Latitude = -28.7511,
                Longitude = 24.7612,
                CapacityMegaLitres = 92.5,
                IsActive = true,
                AreaId = defaultArea?.Id
            };

            var riverton = new Dam
            {
                Name = "Riverton Water Works",
                Latitude = -28.5369,
                Longitude = 24.7061,
                CapacityMegaLitres = 150.0,
                IsActive = true,
                AreaId = defaultArea?.Id
            };

            await context.Dams.AddRangeAsync(newtonRes, riverton);
            await context.SaveChangesAsync();

            // Seed initial readings
            var now = DateTime.UtcNow;
            context.DamReadings.AddRange(
                new DamReading
                {
                    DamId = newtonRes.Id,
                    LevelPercent = 68.5,
                    VolumeMegaLitres = 63.36,
                    RecordedAt = now.AddDays(-2),
                    Source = "Manual"
                },
                new DamReading
                {
                    DamId = newtonRes.Id,
                    LevelPercent = 64.0,
                    VolumeMegaLitres = 59.20,
                    RecordedAt = now.AddDays(-1),
                    Source = "Manual"
                },
                new DamReading
                {
                    DamId = newtonRes.Id,
                    LevelPercent = 62.5,
                    VolumeMegaLitres = 57.81,
                    RecordedAt = now,
                    Source = "Manual"
                },
                new DamReading
                {
                    DamId = riverton.Id,
                    LevelPercent = 82.0,
                    VolumeMegaLitres = 123.0,
                    RecordedAt = now,
                    Source = "Manual"
                }
            );
            await context.SaveChangesAsync();
        }

        // 4. Seed Admin User
        var adminEmail = "admin@aquabophelo.gov.za";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "Sol Plaatje Municipal Admin",
                EmailConfirmed = true,
                AreaId = defaultArea?.Id
            };

            var result = await userManager.CreateAsync(adminUser, "Admin#Aqua2026");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // 5. Seed Driver User
        var driverEmail = "driver@aquabophelo.gov.za";
        var driverUser = await userManager.FindByEmailAsync(driverEmail);
        if (driverUser == null)
        {
            driverUser = new ApplicationUser
            {
                UserName = driverEmail,
                Email = driverEmail,
                FullName = "Sipho Dlamini (Driver)",
                EmailConfirmed = true,
                AreaId = defaultArea?.Id
            };

            var result = await userManager.CreateAsync(driverUser, "Driver#Aqua2026");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(driverUser, "Driver");
            }
        }

        // 6. Seed Sample Delivery Route with Stops
        if (!context.Routes.Any())
        {
            var galesheweArea = context.Areas.FirstOrDefault(a => a.Name == "Galeshewe") ?? defaultArea;
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

        // 7. Seed Sample Water Tanker Trucks
        if (!context.Trucks.Any())
        {
            var trucks = new List<Truck>
            {
                new Truck
                {
                    RegistrationNumber = "NC-542-KM",
                    CapacityLitres = 10000,
                    Status = "Available",
                    DriverId = driverUser?.Id,
                    LastLatitude = -28.7183,
                    LastLongitude = 24.7319,
                    LastSeenAt = DateTime.UtcNow
                },
                new Truck
                {
                    RegistrationNumber = "NC-882-KM",
                    CapacityLitres = 15000,
                    Status = "Available",
                    LastLatitude = -28.7419,
                    LastLongitude = 24.7719,
                    LastSeenAt = DateTime.UtcNow
                },
                new Truck
                {
                    RegistrationNumber = "NC-104-KM",
                    CapacityLitres = 10000,
                    Status = "Available",
                    LastLatitude = -28.6921,
                    LastLongitude = 24.7088,
                    LastSeenAt = DateTime.UtcNow
                }
            };

            await context.Trucks.AddRangeAsync(trucks);
            await context.SaveChangesAsync();
        }
    }
}
