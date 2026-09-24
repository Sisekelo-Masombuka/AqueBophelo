using AquaBophelo.Dtos.Alerts;
using AquaBophelo.Models;
using AquaBophelo.Services.Interfaces;

namespace AquaBophelo.Services;

public class AlertEvaluator : IAlertEvaluator
{
    private readonly IAlertService _alertService;
    private readonly ILogger<AlertEvaluator> _logger;

    public AlertEvaluator(IAlertService alertService, ILogger<AlertEvaluator> logger)
    {
        _alertService = alertService;
        _logger = logger;
    }

    public async Task EvaluateDamReadingAsync(DamReading reading, Dam dam)
    {
        double level = reading.LevelPercent;
        string? alertType = null;
        string? severity = null;
        string? title = null;
        string? message = null;

        if (level < 15.0)
        {
            alertType = "DamCritical";
            severity = "Critical";
            title = $"CRITICAL: {dam.Name} Level Dropped to {level:F1}%";
            message = $"Emergency alert! Water storage in {dam.Name} is at critical capacity ({level:F1}% / {reading.VolumeMegaLitres:F1} ML). Water restriction Level 4 enforced in surrounding areas.";
        }
        else if (level < 30.0)
        {
            alertType = "DamLow";
            severity = "Warning";
            title = $"WARNING: {dam.Name} Water Level Low ({level:F1}%)";
            message = $"{dam.Name} water storage has fallen below 30% ({level:F1}%). Residents in supply areas are urged to restrict non-essential water usage.";
        }
        else if (level < 50.0)
        {
            alertType = "DamWatch";
            severity = "Info";
            title = $"NOTICE: {dam.Name} Level Watch ({level:F1}%)";
            message = $"{dam.Name} level is at {level:F1}%. Reservoir monitoring active.";
        }

        if (alertType != null && severity != null && title != null && message != null)
        {
            _logger.LogWarning(
                "[ALERT EVALUATOR] Threshold triggered for Dam {DamId} ({DamName}): {Severity} - {Title}",
                dam.Id,
                dam.Name,
                severity,
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
    }
}
