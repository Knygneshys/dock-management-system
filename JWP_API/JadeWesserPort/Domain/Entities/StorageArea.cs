using JadeWesserPort.Domain.Entities.Resources;
using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.Domain.Entities;
public class StorageArea
{
    public Guid Id { get; set; }
    public string Code { get; set; } = null!;

    public StorageAreaType Type { get; set; }
    public string Location { get; set; } = null!;
    public int MaxCapacity { get; set; }
    public int CurrentOccupancy { get; set; }

    public Vector3D Position3D { get; set; } = new();
    public Size3D Size3D { get; set; } = new();

    public List<DockRecord> Docks { get; set; } = [];
    public List<StockItem> StockItems { get; set; } = [];
    public List<YardCrane> YardCranes { get; } = [];
}