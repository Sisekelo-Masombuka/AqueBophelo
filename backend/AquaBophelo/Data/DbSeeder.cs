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

        // Ensure DB schema is created or migrated
        try
        {
            if (context.Database.IsRelational())
            {
                await context.Database.MigrateAsync();
            }
            else
            {
                await context.Database.EnsureCreatedAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"DB Migration notice: {ex.Message}");
            await context.Database.EnsureCreatedAsync();
        }

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
                // Ensure password hash is valid for primary password
                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                await userManager.ResetPasswordAsync(user, token, primaryPassword);
            }
        }

        // 4. Seed Admin Users (support both SolPlaatje2026! and Admin123!)
        await SeedUser("admin@aquabophelo.gov.za", "Sol Plaatje Municipal Admin", "Admin", "SolPlaatje2026!");

        // 5. Seed Driver Users
        await SeedUser("sipho.driver@aquabophelo.gov.za", "Sipho Dlamini (Driver)", "Driver", "SolPlaatje2026!");
        await SeedUser("driver@aquabophelo.gov.za", "Sipho Dlamini (Driver)", "Driver", "SolPlaatje2026!");

        // 6. Seed Resident Users
        await SeedUser("nomcebo.resident@gmail.com", "Nomcebo Nkosi", "Resident", "SolPlaatje2026!");
        await SeedUser("resident@aquabophelo.gov.za", "Kimberley Resident", "Resident", "SolPlaatje2026!");

        // 7. Seed Delivery Routes
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

        // 8. Seed Water Tanker Trucks with NC Suffix Plates
        if (!await context.Trucks.AnyAsync())
        {
            var driverUser = await userManager.FindByEmailAsync("sipho.driver@aquabophelo.gov.za");

            var trucks = new List<Truck>
            {
                new Truck
                {
                    RegistrationNumber = "542-KM NC",
                    CapacityLitres = 10000,
                    Status = "Available",
                    DriverId = driverUser?.Id,
                    LastLatitude = -28.7183,
                    LastLongitude = 24.7319,
                    LastSeenAt = DateTime.UtcNow
                },
                new Truck
                {
                    RegistrationNumber = "882-KM NC",
                    CapacityLitres = 15000,
                    Status = "Available",
                    LastLatitude = -28.7419,
                    LastLongitude = 24.7719,
                    LastSeenAt = DateTime.UtcNow
                },
                new Truck
                {
                    RegistrationNumber = "104-KM NC",
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
