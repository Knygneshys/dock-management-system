using JadeWesserPort.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities;

[Index(nameof(AlphanumericCode), IsUnique = true)]
public abstract class Resource
{
    public Guid Id { get; set; }
    public string AlphanumericCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ResourceStatus Status { get; set; } = ResourceStatus.Active;
    public int SetupTimeMinutes { get; set; } = 0;

    public List<Shift> Shifts { get; } = [];
    public List<Qualification> Qualifications { get; } = [];
}
