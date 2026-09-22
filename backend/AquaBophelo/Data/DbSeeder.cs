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
    }
}
