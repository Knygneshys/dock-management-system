using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities;

[Index(nameof(Code), IsUnique = true)]
public class Company
{
    public Guid Id { get; set; }
    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<Vessel>? OwnedVessels { get; set; } = null!;

    public virtual ICollection<Vessel>? OperatedVessels { get; set; } = null!;
    public virtual ICollection<ShippingAgentRepresentative>? Representatives { get; set; }

}