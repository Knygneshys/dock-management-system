using JadeWesserPort.DTOs.CargoManifestDTOs;

namespace JadeWesserPort.DTOs.VVNDTOs;

public class UnloadVVNCreateDTO : VVNCreateDTO
{
    public UnloadCargoManifestDTO CargoManifestDTO { get; set; } = null!;
}
