namespace JadeWesserPort.Domain.Entities.Resources;
public class STSCrane : Resource
{
    public Guid? DockRecordId { get; set; }
    public DockRecord? DockRecord { get; set; }
}
