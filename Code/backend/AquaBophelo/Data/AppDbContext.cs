using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AquaBophelo.Models;

namespace AquaBophelo.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Area> Areas => Set<Area>();
    public DbSet<Dam> Dams => Set<Dam>();
    public DbSet<DamReading> DamReadings => Set<DamReading>();
    public DbSet<Truck> Trucks => Set<Truck>();
    public DbSet<TruckRoute> Routes => Set<TruckRoute>();
    public DbSet<RouteStop> RouteStops => Set<RouteStop>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripStop> TripStops => Set<TripStop>();
    public DbSet<TruckLocation> TruckLocations => Set<TruckLocation>();
    public DbSet<Alert> Alerts => Set<Alert>();
    public DbSet<AlertSubscription> AlertSubscriptions => Set<AlertSubscription>();
    public DbSet<NotificationLog> NotificationLogs => Set<NotificationLog>();
    public DbSet<IssueReport> IssueReports => Set<IssueReport>();
    public DbSet<ScheduledOutage> ScheduledOutages => Set<ScheduledOutage>();
    public DbSet<DriverProblemReport> DriverProblems => Set<DriverProblemReport>();
    public DbSet<VehicleInspectionCheck> VehicleInspectionChecks => Set<VehicleInspectionCheck>();
    public DbSet<EmailOtp> EmailOtps => Set<EmailOtp>();
    public DbSet<DeviceToken> DeviceTokens => Set<DeviceToken>();
    public DbSet<SystemAuditLog> AuditLogs => Set<SystemAuditLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Area relationships
        builder.Entity<Area>()
            .HasMany(a => a.Dams)
            .WithOne(d => d.Area)
            .HasForeignKey(d => d.AreaId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Area>()
            .HasMany(a => a.Users)
            .WithOne(u => u.Area)
            .HasForeignKey(u => u.AreaId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Area>()
            .HasMany(a => a.Routes)
            .WithOne(r => r.Area)
            .HasForeignKey(r => r.AreaId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure Dam readings cascade delete
        builder.Entity<Dam>()
            .HasMany(d => d.Readings)
            .WithOne(r => r.Dam)
            .HasForeignKey(r => r.DamId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Route stops
        builder.Entity<TruckRoute>()
            .HasMany(r => r.Stops)
            .WithOne(s => s.Route)
            .HasForeignKey(s => s.RouteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Trip relationships
        builder.Entity<Trip>()
            .HasOne(t => t.Truck)
            .WithMany(tr => tr.Trips)
            .HasForeignKey(t => t.TruckId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Trip>()
            .HasOne(t => t.Driver)
            .WithMany()
            .HasForeignKey(t => t.DriverId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Trip>()
            .HasOne(t => t.Route)
            .WithMany(r => r.Trips)
            .HasForeignKey(t => t.RouteId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure TripStops
        builder.Entity<TripStop>()
            .HasOne(ts => ts.Trip)
            .WithMany(t => t.TripStops)
            .HasForeignKey(ts => ts.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<TripStop>()
            .HasOne(ts => ts.RouteStop)
            .WithMany()
            .HasForeignKey(ts => ts.RouteStopId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure TruckLocations
        builder.Entity<TruckLocation>()
            .HasOne(tl => tl.Truck)
            .WithMany(t => t.Locations)
            .HasForeignKey(tl => tl.TruckId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Alert relationships
        builder.Entity<Alert>()
            .HasOne(a => a.Dam)
            .WithMany()
            .HasForeignKey(a => a.DamId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Alert>()
            .HasOne(a => a.Area)
            .WithMany()
            .HasForeignKey(a => a.AreaId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure Global Soft Delete Query Filters
        builder.Entity<ApplicationUser>().HasQueryFilter(u => !u.IsDeleted);
        builder.Entity<IssueReport>().HasQueryFilter(i => !i.IsDeleted);

        // Database Performance Indexes (DATA-02)
        builder.Entity<DamReading>()
            .HasIndex(r => new { r.DamId, r.RecordedAt });

        builder.Entity<TruckLocation>()
            .HasIndex(tl => new { tl.TruckId, tl.RecordedAt });

        builder.Entity<TruckLocation>()
            .HasIndex(tl => new { tl.TripId, tl.RecordedAt });

        builder.Entity<Alert>()
            .HasIndex(a => new { a.DamId, a.CreatedAt });

        builder.Entity<Alert>()
            .HasIndex(a => new { a.AreaId, a.CreatedAt });

        builder.Entity<EmailOtp>()
            .HasIndex(o => new { o.Email, o.Purpose, o.CreatedAt });

        builder.Entity<IssueReport>()
            .HasIndex(i => new { i.UserId, i.CreatedAt });

        builder.Entity<IssueReport>()
            .HasIndex(i => new { i.Status, i.CreatedAt });

        builder.Entity<NotificationLog>()
            .HasIndex(n => new { n.UserId, n.SentAt });

        builder.Entity<SystemAuditLog>()
            .HasIndex(l => new { l.Category, l.TimestampUtc });
    }
}
