using JadeWesserPort.Domain.Entities.ValueObjects;

namespace JadeWesserPort.DTOs.PlannedOperationDTOs;

public class PlannedOperationDto
{
  public DateTime Start { get; set; }
  public DateTime End { get; set; }
  public ContainerPosition From { get; set; }
  public ContainerPosition To { get; set; }
  public string ContainerId { get; set; }
}