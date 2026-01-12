using System.Text.Json.Serialization;
using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.DTOs.IncidentTypeDTOs;

public class IncidentTypeResponseDto
{ 
  public required string Code { get; set; }
  public required string Name { get; set; }
  public required string Description { get; set; }
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public SeverityClassification Severity { get; set; }
  public string? ParentIncidentTypeCode { get; set; }
}