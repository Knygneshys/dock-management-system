namespace SchedulePlanning.DTOs;

public class OperationalWindowDto
{
    public string Code { get; set; } = default!;
    public string DayOfWeek { get; set; } = default!;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}
