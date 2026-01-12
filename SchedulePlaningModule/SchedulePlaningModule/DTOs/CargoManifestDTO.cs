using SchedulePlanning.Enums;

namespace SchedulePlanning.DTOs;

public class CargoManifestDTO
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CargoType { get; set; } = string.Empty;
    public List<CargoItemDTO> CargoItems { get; set; } = [];
}
