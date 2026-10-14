using AquaBophelo.Dtos.Alerts;

namespace AquaBophelo.Services.Interfaces;

public interface IAlertService
{
    Task<IEnumerable<AlertResponseDto>> GetAlertsAsync(int? areaId = null, string? type = null);
    Task<AlertResponseDto?> GetAlertByIdAsync(int id);
    Task<AlertResponseDto> CreateAlertAsync(CreateAlertDto dto, string? createdByUserId = null);
}
