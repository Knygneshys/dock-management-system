using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities;

[Index(nameof(ContainerISO), IsUnique = true)]
public class StockItem
{
    public Guid Id { get; set; }
    public string ContainerISO { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public DateTime AvailableSince { get; set; }
    public DateTime AvailableUntil { get; set; }

    public Guid StorageAreaId { get; set; }
    public StorageArea StorageArea { get; set; } = null!;
}
