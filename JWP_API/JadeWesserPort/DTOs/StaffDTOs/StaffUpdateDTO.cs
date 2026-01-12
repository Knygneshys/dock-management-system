using JadeWesserPort.Domain;

namespace JadeWesserPort.DTOs.StaffDTOs;

public class StaffUpdateDTO
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public int? Phone { get; set; }
    public StaffStatus? Status { get; set; } 
    public List<string>? QualificationCodes { get; set; }
}
