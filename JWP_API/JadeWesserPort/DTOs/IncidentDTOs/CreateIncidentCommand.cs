namespace JadeWesserPort.DTOs.IncidentDTOs;

public class CreateIncidentCommand
{
    public string TypeCode { get; set; } = null!;
    public string StartISO { get; set; } = null!;
    public string? EndISO { get; set; }
    public string Description { get; set; } = null!;
    public string ResponsibleUserEmail { get; set; } = null!;
    public int[] AfectedVVECodes { get; set; } = [];
}
