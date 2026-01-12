namespace JadeWesserPort.DTOs.ShiftDTOs;

public class ShiftCreateDto
{
    public int Day { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public int FromHour { get; set; }
    public int FromMinute { get; set; }
    public int ToHour { get; set; }
    public int ToMinute { get; set; }
    public string ResourceCode { get; set; } = null!;

    public DateTime From => new(Year, Month, Day, FromHour, FromMinute, 0);
    public DateTime To => new(Year, Month, Day, ToHour, ToMinute, 0);
}
