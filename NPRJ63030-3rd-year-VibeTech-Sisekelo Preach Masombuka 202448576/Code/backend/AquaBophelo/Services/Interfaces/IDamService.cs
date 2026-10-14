using AquaBophelo.Dtos.Dams;

namespace AquaBophelo.Services.Interfaces;

public interface IDamService
{
    Task<IEnumerable<DamResponseDto>> GetAllDamsAsync();
    Task<DamResponseDto?> GetDamByIdAsync(int id);
    Task<DamResponseDto> CreateDamAsync(CreateDamDto dto);
    Task<DamResponseDto?> UpdateDamAsync(int id, UpdateDamDto dto);
    Task<bool> DeleteDamAsync(int id);

    Task<IEnumerable<DamReadingResponseDto>> GetDamReadingsAsync(int damId, int days = 30);
    Task<DamReadingResponseDto> AddDamReadingAsync(int damId, CreateDamReadingDto dto);
}
