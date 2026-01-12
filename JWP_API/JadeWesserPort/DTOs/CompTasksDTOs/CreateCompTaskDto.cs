namespace JadeWesserPort.DTOs.DockStorageDistanceDTOs.CompTasksDTOs;

public class CreateComplementaryTaskDto
{
    public string CategoryCode { get; set; } = string.Empty;
    public int VveCode { get; set; }
    public string Team { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime Start { get; set; }
    public DateTime? End { get; set; }
    public bool ImpactOnOperations { get; set; }
}