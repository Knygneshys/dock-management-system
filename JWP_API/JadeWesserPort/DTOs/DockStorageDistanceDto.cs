namespace JadeWesserPort.DTOs
{
    public class DockStorageDistanceDto
    {
        public string Code { get; set; } = null!;
        public string DockCode { get; set; } = null!;       
        public string StorageAreaCode { get; set; } = null!; 
        public double DistanceMeters { get; set; }
        public string? Notes { get; set; }
    }
}