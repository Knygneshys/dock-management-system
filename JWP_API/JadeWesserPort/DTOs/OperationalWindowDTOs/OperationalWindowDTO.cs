namespace JadeWesserPort.DTOs.OperationalWindowDTOs;
public class OperationalWindowDTO
{
    public string Code { get; set; } = string.Empty;
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
