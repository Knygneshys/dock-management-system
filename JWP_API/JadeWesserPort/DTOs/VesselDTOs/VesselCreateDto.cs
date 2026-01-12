namespace JadeWesserPort.DTOs.VesselDTOs;

public class VesselCreateDto
{
    public string Imo { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string TypeCode { get; set; } = null!;

    public string OwnerCode { get; set; } = null!;

    public string OperatorCode { get; set; } = null!;
}