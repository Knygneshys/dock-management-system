using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.QualificationDTOs;

namespace JadeWesserPort.DTOs.ResourceDTOs;

public class ResourceDTO
{
    public string AlphanumericCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ResourceStatus Status { get; set; }
    public int SetupTimeMinutes { get; set; } = 0;
    public List<QualificationDTO> Qualifications { get; set; } = [];
}

