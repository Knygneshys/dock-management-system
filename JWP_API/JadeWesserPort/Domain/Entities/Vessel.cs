using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities;

[Index(nameof(Imo), IsUnique = true)]
public class Vessel
{
    public Guid Id { get; set; }

    public string Imo { get; set; } = null!;

    public string Name { get; set; } = null!;

    public Guid TypeId { get; set; }

    public Guid OwnerId { get; set; }
    
    public Guid OperatorId { get; set; }
    
    public VesselType Type { get; set; } = null!;
    
    public Company Owner { get; set; } = null!;

    public Company Operator { get; set; } = null!;
}