using JadeWesserPort.DTOs.DailyScheduleDTOs;

namespace JadeWesserPort.Services.Interfaces;

public interface ISchedulingService
{
    Task<DailyScheduleResponseDto> ScheduleOperationSequenceAsync(DailyScheduleResponseDto schedule);
}