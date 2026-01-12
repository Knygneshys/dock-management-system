using JadeWesserPort.Domain.Entities.Resources;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities;

[Index(nameof(Code), IsUnique = true)]
public class DockRecord
{
    public Guid Id { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;   
    public string Location { get; set; } = null!;
    public float Length { get; set; }
    public float Depth { get; set; }
    public float MaxDraft { get; set; }

    public Vector3D Position3D { get; set; } = new();
    public Size3D Size3D { get; set; } = new();

    public List<VesselVisitNotification> Visits { get; set; } = [];
    public List<VesselType> AllowedVesselTypes { get; set; } = [];
    public List<STSCrane> STSCranes { get; } = [];
}