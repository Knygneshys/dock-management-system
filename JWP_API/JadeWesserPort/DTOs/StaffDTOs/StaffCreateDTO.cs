using JadeWesserPort.Domain;

namespace JadeWesserPort.DTOs.StaffDTOs;

public class StaffCreateDTO
{
    public int MecanographicNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int Phone { get; set; } 
    public StaffStatus Status { get; set; } = StaffStatus.Available;
    public List<string> QualificationCodes { get; set; } = [];
    public bool isActive = true;
}