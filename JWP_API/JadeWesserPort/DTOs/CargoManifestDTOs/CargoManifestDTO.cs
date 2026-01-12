using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.CargoItemDTOs;

namespace JadeWesserPort.DTOs.CargoManifestDTOs;

public class CargoManifestDTO
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public CargoType CargoType { get; set; }
    public List<CargoItemDTO> CargoItems { get; set; } = [];
}
