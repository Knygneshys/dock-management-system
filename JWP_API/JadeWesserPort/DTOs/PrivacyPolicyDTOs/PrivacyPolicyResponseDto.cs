namespace JadeWesserPort.DTOs.DockStorageDistanceDTOs.PrivacyPolicyDTOs;

public class PrivacyPolicyResponseDto
{
    public int Version { get; set; }
    
    public required string Content { get; set; }

    public DateTime CreatedAt { get; set; }
}