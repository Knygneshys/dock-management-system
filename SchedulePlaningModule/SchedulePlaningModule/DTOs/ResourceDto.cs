namespace SchedulePlanning.DTOs;

public class ResourceDto
{
    public string AlphanumericCode { get; set; } = default!;
    public string Description { get; set; } = string.Empty; 
    public string Status { get; set; } = default!;
    public int SetupTimeMinutes { get; set; } = 0;
    public List<QualificationDto> Qualifications { get; set; } = [];        
}
