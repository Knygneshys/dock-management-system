namespace JadeWesserPort.DTOs.VVNDTOs;

public class VVNCreateDTO
{
    public int Code { get; set; }
    public DateTime Eta { get; set; }
    public DateTime Etd { get; set; }
    public string VesselImo { get; set; } = null!;
}
