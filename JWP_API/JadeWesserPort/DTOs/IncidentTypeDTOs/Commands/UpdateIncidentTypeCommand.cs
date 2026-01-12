using System.Text.Json.Serialization;
using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.DTOs.IncidentTypeDTOs.Commands;

public class UpdateIncidentTypeCommand
{
  public required string Name { get; set; }
  public required string Description { get; set; }
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public SeverityClassification Severity { get; set; }
  public string? ParentIncidentTypeCode { get; set; }
}