using JadeWesserPort.DTOs.CargoManifestDTOs;

namespace JadeWesserPort.DTOs.VVNDTOs;

public class FullVVNCreateDTO : VVNCreateDTO
{
    public LoadCargoManifestDTO CargoLoadManifestDTO { get; set; } = null!;
    public UnloadCargoManifestDTO CargoUnloadManifestDTO { get; set; } = null!;
}
