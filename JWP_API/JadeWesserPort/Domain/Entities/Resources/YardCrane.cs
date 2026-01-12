namespace JadeWesserPort.Domain.Entities.Resources;
public class YardCrane : Resource
{
    public Guid? StotageAreaId { get; set; }
    public StorageArea? StorageArea { get; set; }
}
