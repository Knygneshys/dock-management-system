namespace SchedulePlanning.DTOs;

public class RebalanceComparisonDto
{
    public DailyScheduleResponseDto OldSchedule { get; set; } = new();
    public DailyScheduleResponseDto NewSchedule { get; set; } = new();
    public List<VesselDockChangeDto> DockChanges { get; set; } = []; 
}