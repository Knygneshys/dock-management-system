namespace JadeWesserPort.Domain.Entities;

public class CrewMember
{
    public Guid Id { get; set; }
    public int CitizenshipId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Nationality { get; set; } = string.Empty;

    public List<VesselVisitNotification> inVesselVisits { get; } = [];
}
