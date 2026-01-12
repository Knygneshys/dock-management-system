namespace JadeWesserPort.DTOs.ShiftDTOs;

public class ShiftDto
{
    public string From { get; set; } = null!;
    public string To { get; set; } = null!;
    public string ResourceCode { get; set; } = null!;
    public int StaffMNumber { get; set; }
}
