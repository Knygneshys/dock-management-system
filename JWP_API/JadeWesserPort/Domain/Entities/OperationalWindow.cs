namespace JadeWesserPort.Domain;

public class OperationalWindow
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DayOfWeek DayOfWeek { get; set; }

    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime   { get; set; }

    public Guid StaffMemberId { get; set; }
    public StaffMember StaffMember { get; set; } = null!;
    
}