using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Models;

namespace AquaBophelo.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly AppDbContext _context;

    public UsersController(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        AppDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _context = context;
    }

    /// <summary>
    /// GET: api/v1/users
    /// Returns all registered users with their roles, areas, and vehicle assignments.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllUsers([FromQuery] string? role, [FromQuery] string? search)
    {
        var usersQuery = _context.Users
            .Include(u => u.Area)
            .Where(u => !u.IsDeleted)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            usersQuery = usersQuery.Where(u =>
                (u.FullName != null && u.FullName.ToLower().Contains(s)) ||
                (u.Email != null && u.Email.ToLower().Contains(s)) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(s)));
        }

        var usersList = await usersQuery.ToListAsync();
        var trucks = await _context.Trucks.AsNoTracking().ToListAsync();

        var result = new List<object>();

        foreach (var u in usersList)
        {
            var userRoles = await _userManager.GetRolesAsync(u);
            var primaryRole = userRoles.FirstOrDefault() ?? "Resident";

            if (!string.IsNullOrWhiteSpace(role) && !string.Equals(role, "All", StringComparison.OrdinalIgnoreCase) && !string.Equals(primaryRole, role, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            var assignedTruck = trucks.FirstOrDefault(t => t.DriverId == u.Id);
            string truckDisplay = assignedTruck != null 
                ? $"{assignedTruck.RegistrationNumber} ({assignedTruck.CapacityLitres:N0}L)" 
                : (primaryRole == "Driver" ? "Unassigned" : "N/A");

            result.Add(new
            {
                id = u.Id,
                fullName = u.FullName ?? u.UserName ?? "Unnamed User",
                email = u.Email ?? "",
                phone = u.PhoneNumber ?? "N/A",
                role = primaryRole,
                areaName = u.Area?.Name ?? "Sol Plaatje Operations",
                assignedTruck = truckDisplay,
                status = u.EmailConfirmed ? "Active" : "Pending Verification",
                lastLogin = u.CreatedAt.AddHours(2).ToString("yyyy-MM-dd HH:mm CAT")
            });
        }

        return Ok(result);
    }

    /// <summary>
    /// POST: api/v1/users
    /// Creates a new user (Driver, Admin, or Resident) directly from Admin Command Center.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateAdminUserDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
        {
            return BadRequest(new { message = "Valid email address is required." });
        }

        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            return BadRequest(new { message = "Full name is required." });
        }

        var existingUser = await _userManager.FindByEmailAsync(dto.Email.Trim());
        if (existingUser != null)
        {
            return BadRequest(new { message = $"An account with email '{dto.Email}' already exists." });
        }

        var area = await _context.Areas.FirstOrDefaultAsync(a => a.Name == dto.AreaName) 
                   ?? await _context.Areas.FirstOrDefaultAsync();

        var newUser = new ApplicationUser
        {
            UserName = dto.Email.Trim().ToLower(),
            Email = dto.Email.Trim().ToLower(),
            FullName = dto.FullName.Trim(),
            PhoneNumber = dto.PhoneNumber?.Trim(),
            AreaId = area?.Id,
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow
        };

        string passwordToUse = string.IsNullOrWhiteSpace(dto.InitialPassword) ? "SolPlaatje2026!" : dto.InitialPassword.Trim();
        var createResult = await _userManager.CreateAsync(newUser, passwordToUse);

        if (!createResult.Succeeded)
        {
            return BadRequest(new { message = string.Join("; ", createResult.Errors.Select(e => e.Description)) });
        }

        string targetRole = string.IsNullOrWhiteSpace(dto.Role) ? "Driver" : dto.Role.Trim();
        if (!await _roleManager.RoleExistsAsync(targetRole))
        {
            await _roleManager.CreateAsync(new IdentityRole(targetRole));
        }

        await _userManager.AddToRoleAsync(newUser, targetRole);

        // If driver and truck registration provided, link the truck
        if (targetRole == "Driver" && !string.IsNullOrWhiteSpace(dto.AssignedTruckRegistration))
        {
            var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.RegistrationNumber == dto.AssignedTruckRegistration.Trim());
            if (truck != null)
            {
                truck.DriverId = newUser.Id;
                await _context.SaveChangesAsync();
            }
        }

        return Ok(new
        {
            message = $"User account '{newUser.FullName}' ({targetRole}) created successfully.",
            user = new
            {
                id = newUser.Id,
                fullName = newUser.FullName,
                email = newUser.Email,
                role = targetRole,
                areaName = area?.Name ?? "Sol Plaatje Operations"
            }
        });
    }

    /// <summary>
    /// DELETE: api/v1/users/{id}
    /// Soft-deletes a user from the system.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.ScheduledPermanentDeletionAt = DateTime.UtcNow.AddDays(30);
        await _userManager.UpdateAsync(user);

        // Unassign any trucks
        var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.DriverId == id);
        if (truck != null)
        {
            truck.DriverId = null;
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = $"User '{user.FullName}' deactivated successfully." });
    }
}

public class CreateAdminUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = "Driver"; // "Driver" | "Admin" | "Resident"
    public string? AreaName { get; set; }
    public string? AssignedTruckRegistration { get; set; }
    public string? InitialPassword { get; set; }
}
