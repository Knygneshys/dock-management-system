namespace JadeWesserPort.DTOs.VesselDTOs;

public class VesselGetAllDto
{
    public string Imo { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string Owner { get; set; } = null!;

    public string Operator { get; set; } = null!;
}