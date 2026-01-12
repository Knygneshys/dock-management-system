using JadeWesserPort.Domain.Entities.CargoManifests;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.Entities;

[Index(nameof(Code), IsUnique = true)]
public class VesselVisitNotification
{
	public Guid Id { get; set; }
    public int Code { get; set; }
	public DateTime Eta { get; set; }
	public DateTime Etd { get; set; }
	public VVNStatus Status { get; set; }

	public Guid VesselId { get; set; }
	public Vessel Vessel { get; set; } = null!;

	public Guid ShippingAgentRepresentativeId { get; set; }
	public ShippingAgentRepresentative ShippingAgentRepresentative { get; set; } = null!;

	public Guid? FeedBackId { get; set; }
	public VVNFeedback? FeedBack { get; set; }

	public List<CrewMember> CrewManifest { get; } = [];

	public Guid? CargoLoadManifestId { get; set; }
	public CargoLoadManifest? CargoLoadManifest { get; set; }
    public Guid? CargoUnloadManifestId { get; set; }
    public CargoUnloadManifest? CargoUnloadManifest { get; set; }
    public Guid? DockId { get; set; }
    public DockRecord? Dock { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}