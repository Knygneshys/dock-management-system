namespace SchedulePlanning.DTOs;

public class VesselDto
{
    public string Imo { get; set; } = null!;

    public string Name { get; set; } = null!;

    public VesselTypeDto Type { get; set; } = null!;

    public CompanyDto Owner { get; set; } = null!;

    public CompanyDto Operator { get; set; } = null!;
}
