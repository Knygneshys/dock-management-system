using JadeWesserPort.Domain.Entities.ValueObjects;

namespace JadeWesserPort.Domain.Entities;

public class PlannedOperation
{
    public float Start { get; set; }
    
    public float End { get; set; }
    
    public required ContainerPosition From { get; set; }
    
    public required ContainerPosition To { get; set; }
    
    public required string ContainerId { get; set; }
}