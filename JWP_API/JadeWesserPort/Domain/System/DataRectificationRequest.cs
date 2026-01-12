using System;

namespace JadeWesserPort.Domain.System
{
    public class DataRectificationRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime? ProcessedAt { get; set; }
        public string? Justification { get; set; }
        public string? RequestedFields { get; set; }
    }
}
