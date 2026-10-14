using AquaBophelo.Models;

namespace AquaBophelo.Services.Interfaces;

public interface IAlertEvaluator
{
    Task EvaluateDamReadingAsync(DamReading reading, Dam dam);
}
