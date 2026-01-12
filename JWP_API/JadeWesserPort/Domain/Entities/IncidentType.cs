using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.Domain.Entities;

public class IncidentType
{
  public required string Code { get; set; }
  public required string Name { get; set; }
  public required string Description { get; set; }
  public SeverityClassification Severity { get; set; }
  public string? ParentIncidentTypeCode { get; set; }
}