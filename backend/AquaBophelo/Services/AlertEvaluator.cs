using Microsoft.EntityFrameworkCore;
using AquaBophelo.Data;
using AquaBophelo.Dtos.Alerts;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services;

public class AlertEvaluator : IAlertEvaluator
{
    private readonly IAlertService _alertService;
    private readonly AppDbContext _context;
    private readonly ILogger<AlertEvaluator> _logger;

    public AlertEvaluator(
        IAlertService alertService,
        AppDbContext context,
        ILogger<AlertEvaluator> logger)
    {
        _alertService = alertService;
        _context = context;
        _logger = logger;
    }

    public async Task EvaluateDamReadingAsync(DamReading reading, Dam dam)
    {
        double level = reading.LevelPercent;
        string currentStateCategory = GetDamStateCategory(level);

        // Fetch the most recent alert for this dam to inspect state transition
        var lastAlert = await _context.Alerts
            .Where(a => a.DamId == dam.Id)
            .OrderByDescending(a => a.CreatedAt)
            .FirstOrDefaultAsync();

        string? previousStateCategory = GetPreviousCategoryFromAlert(lastAlert);

        // THRESHOLD RULE: Only trigger an alert/email when state category CHANGES (e.g. Healthy -> Watch, Watch -> Warning, Warning -> Critical)
        if (previousStateCategory == currentStateCategory)
        {
            _logger.LogInformation("[ALERT EVALUATOR] Dam {DamId} ({DamName}) level remains in '{State}' category ({Level:F1}%). Skipping duplicate alert dispatch.", dam.Id, dam.Name, currentStateCategory, level);
            return;
        }

        if (currentStateCategory == "Healthy")
        {
            _logger.LogInformation("[ALERT EVALUATOR] Dam {DamId} ({DamName}) returned to Healthy status level ({Level:F1}%).", dam.Id, dam.Name, level);
            return;
        }

        // State category changed! Construct new threshold alert.
        string alertType = currentStateCategory switch
        {
            "Critical" => "DamCritical",
            "Warning" => "DamLow",
            _ => "DamWatch"
        };

        string severity = currentStateCategory switch
        {
            "Critical" => "Critical",
            "Warning" => "Warning",
            _ => "Info"
        };

        string title = currentStateCategory switch
        {
            "Critical" => $"CRITICAL: {dam.Name} Level Dropped to {level:F1}%",
            "Warning" => $"WARNING: {dam.Name} Water Level Low ({level:F1}%)",
            _ => $"NOTICE: {dam.Name} Level Watch ({level:F1}%)"
        };

        string message = currentStateCategory switch
        {
            "Critical" => $"Emergency alert! Water storage in {dam.Name} is at critical capacity ({level:F1}% / {reading.VolumeMegaLitres:F1} ML). Water restriction Level 4 enforced in surrounding areas.",
            "Warning" => $"{dam.Name} water storage has fallen below 30% ({level:F1}%). Residents in supply areas are urged to restrict non-essential water usage.",
            _ => $"{dam.Name} level is at {level:F1}%. Reservoir monitoring active."
        };

        _logger.LogWarning(
            "[ALERT EVALUATOR] State Transition Detected for Dam {DamId} ({DamName}): Previous='{PrevState}', New='{NewState}' ({Level:F1}%) - {Title}",
            dam.Id,
            dam.Name,
            previousStateCategory ?? "None",
            currentStateCategory,
            level,
            title
        );

        var createDto = new CreateAlertDto
        {
            Type = alertType,
            Severity = severity,
            Title = title,
            Message = message,
            DamId = dam.Id,
            AreaId = dam.AreaId
        };

        await _alertService.CreateAlertAsync(createDto, createdByUserId: null);
    }

    private static string GetDamStateCategory(double levelPercent)
    {
        if (levelPercent < 15.0) return "Critical";
        if (levelPercent < 30.0) return "Warning";
        if (levelPercent < 50.0) return "Watch";
        return "Healthy";
    }

    private static string? GetPreviousCategoryFromAlert(Alert? alert)
    {
        if (alert == null) return null;
        return alert.Severity switch
        {
            "Critical" => "Critical",
            "Warning" => "Warning",
            "Info" => "Watch",
            _ => null
        };
    }
}
