namespace JadeWesserPort.DTOs.OperationalWindowDTOs;

public class OperationalWindowFormDTO
{
    public string Code { get; set; } = string.Empty;    
    public DayOfWeek DayOfWeek { get; set; }
    public int StartHour { get; set; }
    public int StartMinute { get; set; }
    public int EndHour { get; set; }
    public int EndMinute { get; set; }


    public TimeOnly StartTime => new(StartHour, StartMinute);
    public TimeOnly EndTime => new(EndHour, EndMinute);
}