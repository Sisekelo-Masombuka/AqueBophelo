using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using AquaBophelo.Data;
using AquaBophelo.Hubs;
using AquaBophelo.Models;
using AquaBophelo.Services;
using AquaBophelo.Services.Interfaces;
using Microsoft.AspNetCore.RateLimiting;
using AquaBophelo.Services.Notifications;
using AquaBophelo.Services.Storage;
using AquaBophelo.Services.Security;
using AquaBophelo.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configure Sentry Application Monitoring & Crash Telemetry
builder.WebHost.UseSentry(options =>
{
    options.Dsn = builder.Configuration["Sentry:Dsn"];
    options.SendDefaultPii = false; // Guarantee privacy compliance (POPIA/GDPR)
    options.TracesSampleRate = builder.Configuration.GetValue<double>("Sentry:TracesSampleRate", builder.Environment.IsDevelopment() ? 1.0 : 0.1);
    options.MinimumEventLevel = LogLevel.Error;
    options.SetBeforeSend((sentryEvent, hint) =>
    {
        // PII Scrubbing: Remove sensitive authentication tokens and cookies from request headers
        if (sentryEvent.Request?.Headers != null)
        {
            sentryEvent.Request.Headers.Remove("Authorization");
            sentryEvent.Request.Headers.Remove("api-key");
            sentryEvent.Request.Headers.Remove("Cookie");
            sentryEvent.Request.Headers.Remove("Set-Cookie");
        }

        // Scrub query string PII (e.g. tokens, passwords, or emails in query parameters)
        if (sentryEvent.Request?.Url != null)
        {
            try
            {
                var uri = new Uri(sentryEvent.Request.Url);
                if (!string.IsNullOrEmpty(uri.Query))
                {
                    sentryEvent.Request.Url = uri.GetLeftPart(UriPartial.Path);
                }
            }
            catch { /* non-fatal URL parsing guard */ }
        }

        // Scrub request payload/body to guarantee zero PII or credential leakage
        if (sentryEvent.Request != null)
        {
            sentryEvent.Request.Data = null;
        }

        sentryEvent.SetTag("environment", builder.Environment.EnvironmentName);
        return sentryEvent;
    });
});

// Add services to the container.
builder.Services.AddControllers();

// Configure Brevo Email, R2 Storage & Turnstile options
builder.Services.Configure<BrevoOptions>(builder.Configuration.GetSection(BrevoOptions.Position));
builder.Services.Configure<R2Options>(builder.Configuration.GetSection(R2Options.Position));
builder.Services.Configure<TurnstileOptions>(builder.Configuration.GetSection(TurnstileOptions.Position));

// Configure ASP.NET Core Built-in Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            message = "Too many requests. Please wait a moment before trying again.",
            statusCode = 429
        }, cancellationToken);
    };

    // Strict policy for Auth/OTP endpoints: 5 requests per 1-minute window
    options.AddFixedWindowLimiter("AuthStrictPolicy", policyOptions =>
    {
        policyOptions.PermitLimit = 5;
        policyOptions.Window = TimeSpan.FromMinutes(1);
        policyOptions.QueueLimit = 0;
    });

    // General API policy: 60 requests per 1-minute window
    options.AddFixedWindowLimiter("GeneralApiPolicy", policyOptions =>
    {
        policyOptions.PermitLimit = 60;
        policyOptions.Window = TimeSpan.FromMinutes(1);
        policyOptions.QueueLimit = 0;
    });
});

// Configure AppDbContext with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;

    // Lockout settings (AUTH-04: Brute-force protection)
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Configure Secure Application Cookie Policy
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

// Configure ASP.NET Core Data Protection Key Ring Persistence (for multi-instance load balancing)
var dataProtectionBuilder = builder.Services.AddDataProtection()
    .SetApplicationName("AquaBophelo");

var dpKeysPath = builder.Configuration["DataProtection:KeysPath"] 
    ?? Environment.GetEnvironmentVariable("DATA_PROTECTION_KEYS_PATH")
    ?? (builder.Environment.IsProduction() ? "/var/dataprotection-keys" : Path.Combine(AppContext.BaseDirectory, "dataprotection-keys"));

try
{
    var keysDir = new DirectoryInfo(dpKeysPath);
    if (!keysDir.Exists)
    {
        keysDir.Create();
    }
    dataProtectionBuilder.PersistKeysToFileSystem(keysDir);
}
catch (Exception ex)
{
    Console.WriteLine($"[DataProtection] Note: Persistent directory '{dpKeysPath}' initialization notice: {ex.Message}");
}

// Configure HSTS Policy for Production
builder.Services.AddHsts(options =>
{
    options.Preload = true;
    options.IncludeSubDomains = true;
    options.MaxAge = TimeSpan.FromDays(365);
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetBytes(jwtKey).Length < 32)
{
    throw new InvalidOperationException("Fatal Security Startup Error: 'Jwt:Key' is missing or has insufficient entropy (< 32 bytes / 256 bits). Configure a secure 256-bit or 512-bit signing key in your platform secrets store.");
}
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Fatal Security Startup Error: 'Jwt:Issuer' is not configured in appsettings, environment variables, or user-secrets.");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Fatal Security Startup Error: 'Jwt:Audience' is not configured in appsettings, environment variables, or user-secrets.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };

    // Configure SignalR WebSocket JWT Authentication token parsing
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var path = context.HttpContext.Request.Path;
            if (path.StartsWithSegments("/hubs"))
            {
                // Support both standard SignalR query string token and secure cookie token
                var accessToken = context.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
                else if (context.Request.Cookies.TryGetValue("aquabophelo_token", out var cookieToken) && !string.IsNullOrEmpty(cookieToken))
                {
                    context.Token = cookieToken;
                }
            }
            return Task.CompletedTask;
        }
    };
});

// Register Domain Services
builder.Services.AddSingleton<IEmailQueue, EmailQueue>();
builder.Services.AddHostedService<EmailQueueBackgroundService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<DryRunNotificationService>();
builder.Services.AddHttpClient<BrevoEmailSender>();
builder.Services.AddScoped<IEmailSender>(sp => sp.GetRequiredService<BrevoEmailSender>());
builder.Services.AddScoped<INotificationService>(sp => sp.GetRequiredService<BrevoEmailSender>());
builder.Services.AddSingleton<IR2StorageService, R2StorageService>();
builder.Services.AddSingleton<IPushNotificationService, FirebasePushNotificationService>();
builder.Services.AddSingleton<IAuditLogger, AuditLogger>();
builder.Services.AddHttpClient<ITurnstileService, TurnstileService>();
builder.Services.AddScoped<IAlertService, AlertService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<IAlertEvaluator, AlertEvaluator>();
builder.Services.AddScoped<IDamService, DamService>();

// Configure CORS for Frontend React SPA
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        string[] allowedOrigins;

        if (builder.Environment.IsProduction())
        {
            // In Production, strictly require production origins and never fallback to localhost
            allowedOrigins = configuredOrigins != null && configuredOrigins.Length > 0
                ? configuredOrigins
                : new[] { "https://aquabophelo.app", "https://www.aquabophelo.app" };
        }
        else
        {
            // In Development, permit local Vite & Docker dev servers
            allowedOrigins = configuredOrigins != null && configuredOrigins.Length > 0
                ? configuredOrigins
                : new[] { "http://localhost:5173", "https://localhost:5173", "http://localhost:3000", "https://aquabophelo.app", "https://www.aquabophelo.app" };
        }

        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add SignalR real-time messaging service (with optional Redis scale-out backplane for multi-instance deployments)
var signalRBuilder = builder.Services.AddSignalR();
var redisConnectionString = builder.Configuration["Redis:ConnectionString"] 
    ?? Environment.GetEnvironmentVariable("REDIS_CONNECTIONSTRING");

if (!string.IsNullOrWhiteSpace(redisConnectionString))
{
    signalRBuilder.AddStackExchangeRedis(redisConnectionString, options =>
    {
        options.Configuration.ChannelPrefix = StackExchange.Redis.RedisChannel.Literal("AquaBophelo_SignalR");
    });
}

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Global Exception Handling Safety Net (Returns RFC 7807 ProblemDetails instead of raw HTML stack trace)
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(exception, "Unhandled exception occurred while processing request path {Path}", context.Request.Path);

        int statusCode = StatusCodes.Status500InternalServerError;
        string detail = "An internal server error occurred while processing your request.";

        if (exception is BadHttpRequestException badRequestEx)
        {
            statusCode = badRequestEx.StatusCode;
            detail = badRequestEx.Message;
        }
        else if (exception is UnauthorizedAccessException)
        {
            statusCode = StatusCodes.Status401Unauthorized;
            detail = "You are not authorized to perform this action.";
        }
        else if (exception is KeyNotFoundException)
        {
            statusCode = StatusCodes.Status404NotFound;
            detail = "The requested resource was not found.";
        }

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        var problemDetails = new
        {
            type = $"https://httpstatuses.io/{statusCode}",
            title = statusCode switch
            {
                400 => "Bad Request",
                401 => "Unauthorized",
                403 => "Forbidden",
                404 => "Not Found",
                _ => "Internal Server Error"
            },
            status = statusCode,
            detail = detail,
            instance = context.Request.Path.Value,
            timestamp = DateTime.UtcNow
        };

        await context.Response.WriteAsJsonAsync(problemDetails);
    });
});

// Correlation ID & Request Tracing Middleware
app.Use(async (context, next) =>
{
    const string CorrelationIdHeader = "X-Correlation-ID";
    if (!context.Request.Headers.TryGetValue(CorrelationIdHeader, out var correlationId) || string.IsNullOrWhiteSpace(correlationId))
    {
        correlationId = Guid.NewGuid().ToString("N");
    }
    context.Response.Headers.Append(CorrelationIdHeader, correlationId);
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    using (logger.BeginScope(new Dictionary<string, object>
    {
        ["CorrelationId"] = correlationId.ToString(),
        ["User"] = context.User?.Identity?.Name ?? "Anonymous"
    }))
    {
        await next();
    }
});

// Security Headers Middleware (SEC-03: Protection against MIME-sniffing, clickjacking, and information leakage)
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("X-Permitted-Cross-Domain-Policies", "none");

    var cspScriptSrc = app.Environment.IsDevelopment()
        ? "'self' 'unsafe-inline' https://challenges.cloudflare.com https://cdn.jsdelivr.net"
        : "'self' https://challenges.cloudflare.com";

    var isReportOnly = builder.Configuration.GetValue<bool>("CSP_REPORT_ONLY", false);
    var cspHeaderName = isReportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";

    context.Response.Headers.Append(cspHeaderName,
        "default-src 'self'; " +
        $"script-src {cspScriptSrc}; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com data:; " +
        "connect-src 'self' wss://api.aquabophelo.app https://api.aquabophelo.app https://challenges.cloudflare.com https://*.sentry.io; " +
        "img-src 'self' data: https://media.aquabophelo.app; " +
        "frame-src https://challenges.cloudflare.com; " +
        "frame-ancestors 'none';");
    await next();
});

// 1. Apply Database Schema Migrations (default true in Development, strictly false in Production unless explicitly commanded)
var shouldMigrate = app.Environment.IsDevelopment()
    ? builder.Configuration.GetValue<bool>("MIGRATE_ON_START", true)
    : builder.Configuration.GetValue<bool>("MIGRATE_ON_START", false);
if (shouldMigrate)
{
    try
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
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
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Failed to apply database migrations on startup.");
        if (!app.Environment.IsDevelopment()) throw; // In production, fail-fast on migration failure
    }
}

// 2. Seed Reference Data (Gated strictly by SEED_DATABASE=true or Development mode)
var shouldSeed = app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("SEED_DATABASE", false);
if (shouldSeed)
{
    try
    {
        using var scope = app.Services.CreateScope();
        await DbSeeder.SeedAsync(scope.ServiceProvider);
    }
    catch (Exception ex)
    {
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Non-fatal warning: Database reference data seeding encountered an error on startup.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

// Enable CORS policy before Authorization
app.UseCors("Frontend");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireRateLimiting("GeneralApiPolicy");
app.MapHub<PingHub>("/hubs/ping");
app.MapHub<TruckHub>("/hubs/trucks");

// Top-level liveness & readiness probes for Kubernetes, Docker and Azure App Service
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));
app.MapGet("/health/live", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));
app.MapGet("/health/ready", async (AppDbContext context, IEmailQueue emailQueue) =>
{
    var isDbHealthy = false;
    try
    {
        isDbHealthy = await context.Database.CanConnectAsync();
    }
    catch { isDbHealthy = false; }

    var isQueueHealthy = false;
    var isDeliveryHealthy = true;
    try
    {
        isQueueHealthy = emailQueue != null && emailQueue.IsOperational && emailQueue.IsWorkerHealthy;
        isDeliveryHealthy = emailQueue == null || emailQueue.IsDeliveryHealthy;
    }
    catch { isQueueHealthy = false; isDeliveryHealthy = false; }

    var isHealthy = isDbHealthy && isQueueHealthy && isDeliveryHealthy;

    var result = new
    {
        status = isHealthy ? "healthy" : "degraded",
        database = isDbHealthy ? "connected" : "unreachable",
        messageQueue = isQueueHealthy ? "active" : "offline",
        deliveryStatus = isDeliveryHealthy ? "healthy" : "failing",
        consecutiveDeliveryFailures = emailQueue?.ConsecutiveFailureCount ?? 0,
        lastSuccessfulDeliveryUtc = emailQueue?.LastSuccessfulDeliveryUtc,
        lastDeliveryFailureUtc = emailQueue?.LastDeliveryFailureUtc,
        lastDeliveryFailureReason = emailQueue?.LastDeliveryFailureReason,
        lastWorkerHeartbeatUtc = emailQueue?.LastHeartbeatUtc,
        timestamp = DateTime.UtcNow
    };

    return isHealthy 
        ? Results.Ok(result) 
        : Results.Json(result, statusCode: StatusCodes.Status503ServiceUnavailable);
});

app.Run();
