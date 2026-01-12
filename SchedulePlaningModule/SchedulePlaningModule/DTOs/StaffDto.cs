namespace SchedulePlanning.DTOs;

public class StaffDto
{
    public int MecanographicNumber { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public long Phone { get; set; }

    public string Status { get; set; } = default!;
    public bool IsActive { get; set; }

    public List<QualificationDto> Qualifications { get; set; } = new();
    public List<OperationalWindowDto> OperationalWindows { get; set; } = new();
}
