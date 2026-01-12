namespace JadeWesserPort.DTOs.VVEDTOs;

public class VVEDto
{
    public int Code { get; set; }
    public int VvnCode { get; set; }
    public string VesselImo { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime ArrivalTime { get; set; }
    public string CreatorUserEmail { get; set; } = string.Empty;
    public string DockCode { get; set; } = string.Empty;
}