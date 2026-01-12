using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.DTOs.ResourceDTOs;
public class ResourceUpdateDTO
{
    public string Description { get; set; } = string.Empty;
    public ResourceStatus Status { get; set; }
    public int SetupTimeMinutes { get; set; } = 0;
    public List<string> Qualifications { get; set; } = [];
}
