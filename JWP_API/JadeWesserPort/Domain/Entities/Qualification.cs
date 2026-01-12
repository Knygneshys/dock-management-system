using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities;

[Index(nameof(Code), IsUnique = true)] 
public class Qualification
{
    public Guid Id { get; set; }
    
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public List<Resource> Resources { get; } = [];
    public List<StaffMember> StaffMembers { get; set; } = [];

}
