using JadeWesserPort.DTOs.DockRecordDTOs;
using JadeWesserPort.DTOs.StorageAreaDTOs;

namespace JadeWesserPort.DTOs.PortLayoutDTOs;

public class PortLayoutDto
{
    public List<DockRecordDto> Docks { get; set; } = [];
    public List<StorageAreaDto> StorageAreas { get; set; } = [];
}
