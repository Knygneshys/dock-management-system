using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.OperationalWindowDTOs;
using JadeWesserPort.DTOs.QualificationDTOs;

namespace JadeWesserPort.DTOs.StaffDTOs;

public class StaffDTO
{
    public int MecanographicNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int Phone { get; set; }
    public StaffStatus Status { get; set; } = StaffStatus.Available;
    public List<QualificationDTO> Qualifications { get; set; } = [];
    public List<OperationalWindowDTO> OperationalWindows { get; set; } = [];
    public bool isActive { get; set; }
}
