using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.Domain.Entities;

public class CargoManifest
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public CargoType CargoType { get; set; }
    public List<CargoItem> CargoItems { get; set; } = [];
    public VesselVisitNotification VVN { get; set; } = null!;
}
