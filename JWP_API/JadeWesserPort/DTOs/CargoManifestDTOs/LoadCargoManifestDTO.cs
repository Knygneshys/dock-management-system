using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.DTOs.CargoManifestDTOs;

public class LoadCargoManifestDTO
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public CargoType CargoType { get; set; }
    public List<string> CargoItemCodes { get; set; } = [];
}
