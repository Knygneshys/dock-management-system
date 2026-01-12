using System.Text.Json.Serialization;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.PlannedOperationDTOs;

namespace JadeWesserPort.DTOs.OperationPlanDTOs;

public class OperationPlanResponseDto
{
  public int VvnCode { get; set; }
  public string DockCode { get; set; }
  public List<string> CraneCodes { get; set; }
  public List<int> StaffCodes { get; set; }
  public string StorageAreaCode { get; set; }
  public DateTime Start { get; set; }
  public DateTime End { get; set; }
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public AlgorithmType UsedAlgorithm { get; set; }
  public string CreatorUserEmail { get; set; }
  public List<PlannedOperationDto> PlannedOperations { get; set; }
  public DateTime CreatedAt { get; set; }
}