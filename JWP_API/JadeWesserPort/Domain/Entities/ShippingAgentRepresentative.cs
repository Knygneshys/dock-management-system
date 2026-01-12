using JadeWesserPort.Domain.System;

namespace JadeWesserPort.Domain.Entities;

public class ShippingAgentRepresentative
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    public Guid CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public List<VesselVisitNotification> VesselVisitNotifications { get; } = [];
}