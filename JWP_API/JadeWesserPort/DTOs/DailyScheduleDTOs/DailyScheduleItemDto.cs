using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.DTOs.DailyScheduleDTOs;

public class DailyScheduleItemDto
{
    public int VVNCode { get; set; }
    public string DockCode { get; set; } = null!;
    public string[] CraneCodes { get; set; } = [];
    public int[] StaffCodes { get; set; } = [];
    public int Start { get; set; }
    public int End { get; set; }
    public string StorageAreaCode { get; set; } = default!;
    public List<PlannedOperation>? PlannedOperations { get; set; }
}