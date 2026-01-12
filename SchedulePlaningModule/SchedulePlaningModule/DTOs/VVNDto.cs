namespace SchedulePlanning.DTOs;
    
public class VVNDto
{
    public int Code { get; set; }
    public DateTime Eta { get; set; }
    public DateTime Etd { get; set; }
    public string Status { get; set; } = null!;

    public VesselDto Vessel { get; set; } = null!;
    public ShippingAgentRepresentativeDTO ShippingAgentRepresentative { get; set; } = null!;
    public DockRecordDto? Dock { get; set; }

    public CargoManifestDTO? CargoLoadManifest { get; set; }
    public CargoManifestDTO? CargoUnloadManifest { get; set; }
}

