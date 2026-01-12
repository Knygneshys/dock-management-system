namespace SchedulePlanning.DTOs;

public class VesselTypeDto
{
    public string Code { get; set; } = null!;
    
    public string Name { get; set; }  = null!;

    public string Description { get; set; } = null!;

    public int Capacity { get; set; }

    public int MaxRows { get; set; }

    public int MaxBays { get; set; }

    public int MaxTiers { get; set; }
    
    public float Length { get; set; }
    
    public float Draft { get; set; }
}
