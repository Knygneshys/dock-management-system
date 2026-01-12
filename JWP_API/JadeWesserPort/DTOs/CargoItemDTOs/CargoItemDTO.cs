using JadeWesserPort.Domain.Entities.ValueObjects;

namespace JadeWesserPort.DTOs.CargoItemDTOs;

public class CargoItemDTO
{
    public string ContainerISO { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public ContainerPosition VesselContainerPosition { get; set; } = null!;
}
