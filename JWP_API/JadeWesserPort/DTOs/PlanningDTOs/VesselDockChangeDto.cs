namespace JadeWesserPort.DTOs.PlanningDTOs;

public class VesselDockChangeDto
{
    public int VVNCode { get; set; }
    public string VesselName { get; set; } = string.Empty;
    public string OldDock { get; set; } = string.Empty;
    public string NewDock { get; set; } = string.Empty;
}