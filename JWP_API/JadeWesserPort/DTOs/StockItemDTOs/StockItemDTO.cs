using JadeWesserPort.DTOs.StorageAreaDTOs;

namespace JadeWesserPort.DTOs.StockItemDTOs;
public class StockItemDTO
{
    public string ContainerISO { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public DateTime AvailableSince { get; set; }
    public DateTime AvailableUntil { get; set; }
    public StorageAreaDto StorageArea { get; set; } = null!;
}
