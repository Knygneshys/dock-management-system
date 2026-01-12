using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.CargoManifestDTOs;
using JadeWesserPort.DTOs.DockRecordDTOs;
using JadeWesserPort.DTOs.ShippingAgentRepresentativeDTOs;
using JadeWesserPort.DTOs.VesselDTOs;

namespace JadeWesserPort.DTOs.VVNDTOs;
    
public class VVNDto
{
    public int Code { get; set; } 
    public DateTime Eta { get; set; } 
    public DateTime Etd { get; set; } 
    public VVNStatus Status { get; set; }

    public VesselDto Vessel { get; set; } = null!;
    public ShippingAgentRepresentativeDTO ShippingAgentRepresentative { get; set; } = null!;
    public DockRecordDto? Dock { get; set; }

    public CargoManifestDTO? CargoLoadManifest { get; set; }
    public CargoManifestDTO? CargoUnloadManifest { get; set; }
}

