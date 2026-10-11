using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
    options.TracesSampleRate = 1.0;
    options.MinimumEventLevel = LogLevel.Error;
    options.SetBeforeSend((sentryEvent, hint) =>
    {
        // PII Scrubbing: Remove sensitive authentication tokens from request headers
        if (sentryEvent.Request?.Headers != null)
        {
            sentryEvent.Request.Headers.Remove("Authorization");
            sentryEvent.Request.Headers.Remove("api-key");
        }
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
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Fatal Security Startup Error: 'Jwt:Key' is not configured in appsettings, environment variables, or user-secrets.");
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
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
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
builder.Services.AddScoped<IEmailSender, BrevoEmailSender>();
builder.Services.AddScoped<INotificationService, BrevoEmailSender>();
builder.Services.AddSingleton<IR2StorageService, R2StorageService>();
builder.Services.AddSingleton<IPushNotificationService, FirebasePushNotificationService>();
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
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:5173" };

        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add SignalR real-time messaging service
builder.Services.AddSignalR();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Global Exception Handling Safety Net (Returns clean JSON 500 error instead of raw HTML stack trace)
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(exception, "Unhandled exception occurred while processing request path {Path}", context.Request.Path);

        var response = new
        {
            message = "An internal server error occurred while processing your request.",
            path = context.Request.Path.Value,
            timestamp = DateTime.UtcNow
        };

        await context.Response.WriteAsJsonAsync(response);
    });
});

// Seed Database
using (var scope = app.Services.CreateScope())
{
    await DbSeeder.SeedAsync(scope.ServiceProvider);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Enable CORS policy before Authorization
app.UseCors("Frontend");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<PingHub>("/hubs/ping");
app.MapHub<TruckHub>("/hubs/trucks");

app.Run();
