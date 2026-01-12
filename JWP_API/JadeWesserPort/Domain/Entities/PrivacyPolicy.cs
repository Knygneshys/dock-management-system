using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain;

[Index(nameof(Version), IsUnique = true)]
public class PrivacyPolicy
{
    public Guid Id { get; set; }
    
    public int Version { get; set; }
    
    public required string Content { get; set; }

    public DateTime CreatedAt { get; set; }
}