using JadeWesserPort.DTOs.CargoManifestDTOs;

namespace JadeWesserPort.DTOs.VVNDTOs;

public class LoadVVNCreateDTO : VVNCreateDTO
{
    public LoadCargoManifestDTO CargoManifestDTO { get; set; } = null!;
}
