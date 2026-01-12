using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities.ValueObjects;

[Owned]
public class ContainerPosition
{
    public int Bay { get; set; }
    public int Row { get; set; }
    public int Tier { get; set; }
}
