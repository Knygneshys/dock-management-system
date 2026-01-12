using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain;

[Index(nameof(MecanographicNumber), IsUnique = true)]
public class StaffMember
{
    public int MecanographicNumber { get; set; }
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int Phone { get; set; }
    public StaffStatus Status { get; set; } = StaffStatus.Available;
    
    public List<Qualification> Qualifications { get; set; } = [];
    public List<OperationalWindow> OperationalWindows { get; set; } = [];
    public List<Shift> Shifts { get; set; } = [];
    public bool isActive { get; set; }
}

