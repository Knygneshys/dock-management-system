namespace JadeWesserPort.Domain.Entities
{
    public class DockStorageDistance
    {
        public Guid Id { get; set; }
        
        public string Code { get; set; } = null!;
        
        public Guid DockRecordId { get; set; }
        public DockRecord DockRecord { get; set; } = null!;

        public Guid StorageAreaId { get; set; }
        public StorageArea StorageArea { get; set; } = null!;
        
        public double DistanceMeters { get; set; }
        
        public string? Notes { get; set; }
    }
}