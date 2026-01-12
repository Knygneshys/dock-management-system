using SchedulePlanning.DTOs;
using SchedulePlanning.Enums;

namespace SchedulePlanning.Services.Interfaces;
public interface IPlanningService
{
    Task<DailyScheduleResponseDto> GenerateDailyScheduleAsync(
        DateOnly date, 
        AlgorithmType  algorithmType,
        List<VVNDto> visits,
        List<StaffDto> allStaff,
        int? timeLimitMs);
    Task<RebalanceComparisonDto> GenerateRebalanceComparisonAsync(
        DateOnly date,
        List<VVNDto> visits,
        List<StaffDto> allStaff,
        List<DockRecordDto> allDocks);
}
