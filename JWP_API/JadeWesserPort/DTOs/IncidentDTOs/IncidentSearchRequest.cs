namespace JadeWesserPort.DTOs.IncidentDTOs;

public class IncidentSearchRequest
{
    public int? VveCode { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Status { get; set; }
    public string? Severity { get; set; }
}
