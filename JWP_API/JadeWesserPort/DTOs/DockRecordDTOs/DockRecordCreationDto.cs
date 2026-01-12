namespace JadeWesserPort.DTOs.DockRecordDTOs;

public class DockRecordCreationDto
{
    public string Name { get; set; } = null!;
    public string Location { get; set; } = null!;
    public float Length { get; set; }
    public float Depth { get; set; }
    public float MaxDraft { get; set; }

    public float X { get; set; }
    public float Y { get; set; }
    public float Z { get; set; }

    public List<string>? VesselTypeCodes { get; set; }
    
}
