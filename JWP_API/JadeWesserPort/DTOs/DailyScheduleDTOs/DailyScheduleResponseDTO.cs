using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.DTOs.DailyScheduleDTOs;

public class DailyScheduleResponseDto
{
    public bool Ok { get; set; }
    public DateOnly Date { get; set; }
    public int TotalDelay { get; set; } = 0;
    public List<DailyScheduleItemDto>? Items { get; set; }
    public string? Reason { get; set; }
    public List<AlgorithmType> AlgorithmsUsed { get; set; } = [];
    public double ComputeDurationMs { get; set; } = 0;
}
