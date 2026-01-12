using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Domain;

public class Shift
{
    public Guid Id { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public Guid StaffMemberId { get; set; }
    public StaffMember StaffMember { get; set; } = null!;
    public Guid ResourceId { get; set; }
    public Resource Resource { get; set; } = null!;
}