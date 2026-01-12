using System.Text.Json.Serialization;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.PlannedOperationDTOs;

namespace JadeWesserPort.Domain.Entities;

public class OperationPlan
{
  public int VvnCode { get; set; }
  public string DockCode { get; set; }
  public string CraneCode { get; set; }
  public int StaffCode { get; set; }
  public string StorageAreaCode { get; set; }
  public DateTime Start { get; set; }
  public DateTime End { get; set; }
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public AlgorithmType UsedAlgorithm { get; set; }
  public string CreatorUserEmail { get; set; }
  public List<PlannedOperation> PlannedOperations { get; set; }
  public DateTime CreatedAt { get; set; }
}