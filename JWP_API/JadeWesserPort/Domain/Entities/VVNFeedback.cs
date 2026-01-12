namespace JadeWesserPort.Domain.Entities;

public class VVNFeedback
{
    public Guid Id { get; set; }
    public string OfficerId { get; set; } = null!;
    public string Reason { get; set; } = null!;
    public VVNStatus Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
