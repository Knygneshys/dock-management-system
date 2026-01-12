using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities;

[Index(nameof(Code), IsUnique = true)]
public class VesselType
{
    public Guid Id { get; set; }
    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Capacity { get; set; }

    public int MaxRows { get; set; }

    public int MaxBays { get; set; }

    public int MaxTiers { get; set; }
    
    public float Length { get; set; }
    
    public float Draft { get; set; }
    
    public virtual ICollection<DockRecord> Docks { get; set; } = new List<DockRecord>();

    public virtual ICollection<Vessel>? Vessels { get; set; }
   
     
    
}