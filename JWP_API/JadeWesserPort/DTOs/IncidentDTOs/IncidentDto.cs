using JadeWesserPort.Domain.Entities.ValueObjects;
using JadeWesserPort.DTOs.IncidentTypeDTOs;
using JadeWesserPort.DTOs.VVEDTOs;

namespace JadeWesserPort.DTOs.IncidentDTOs;

public class IncidentDto
{
    public string? Code { get; set; }
    public IncidentTypeResponseDto? Type { get; set; }
    public string? StartISO { get; set; }
    public string? EndISO { get; set; }
    public string? Description { get; set; }
    public string? ResponsibleUserEmail { get; set; }
    public string? Status { get; set; }
    public VVEDto[]? AfectedVVEs { get; set; }
    public Time? Duration { get; set; }
}
