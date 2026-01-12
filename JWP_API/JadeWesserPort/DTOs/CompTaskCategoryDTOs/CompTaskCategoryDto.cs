using JadeWesserPort.Domain.Entities.ValueObjects;

namespace JadeWesserPort.DTOs.CompTaskCategoryDTOs;

public class CompTaskCategoryDto
{
    public string? Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Time? DefaultDelay { get; set; }
}