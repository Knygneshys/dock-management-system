using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.DTOs.StorageAreaDTOs;

public class StorageAreaCreationDto
{
    public string Code { get; set; } = null!;
    public StorageAreaType Type { get; set; } 
    public string Location { get; set; } = null!;
    public int MaxCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public float X { get; set; }
    public float Y { get; set; }
    public float Z { get; set; }
    public float Width { get; set; }
    public float Height { get; set; }
    public float Depth { get; set; }
}