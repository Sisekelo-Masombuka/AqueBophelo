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

        // Ensure DB created
        await context.Database.EnsureCreatedAsync();

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
        if (!context.Areas.Any())
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

        var defaultArea = context.Areas.FirstOrDefault(a => a.Name == "Kimberley Central");

        // 3. Seed Reservoirs & Dams
        if (!context.Dams.Any())
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

            // Initial baseline readings
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

        // 4. Seed Admin User
        var adminEmail = "admin@aquabophelo.gov.za";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FullName = "Sol Plaatje Municipal Admin",
                AreaId = defaultArea?.Id
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // 5. Seed Sample Driver User
        var driverEmail = "driver@aquabophelo.gov.za";
        var driverUser = await userManager.FindByEmailAsync(driverEmail);

        if (driverUser == null)
        {
            driverUser = new ApplicationUser
            {
                UserName = driverEmail,
                Email = driverEmail,
                EmailConfirmed = true,
                FullName = "Sipho Dlamini (Driver)",
                AreaId = defaultArea?.Id
            };

            var result = await userManager.CreateAsync(driverUser, "Driver123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(driverUser, "Driver");
            }
        }

        // 6. Seed Sample Delivery Route
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
