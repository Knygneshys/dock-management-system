using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.DTOs.ResourceDTOs;
public class ResourceCreateDTO
{
    public string AlphanumericCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ResourceStatus Status { get; set; }
    public int SetupTimeMinutes { get; set; } = 0;
    public List<string> Qualifications { get; set; } = [];

    public string? DockRecordCode { get; set; }
    public string? StorageAreaCode { get; set; }

    public ResourceTypes ResourceType { get; set; }
}
