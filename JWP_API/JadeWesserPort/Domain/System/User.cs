using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Domain.System;

[Index(nameof(Email), IsUnique = true)]
[Index(nameof(Auth0Id), IsUnique = true)]
public class User
{
    public Guid Id { get; set; }
    public string? Auth0Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = false;
    public bool HasReadPrivacyPolicy { get; set; } = false;
    
    public string? ActivationToken { get; set; }
    public DateTime? ActivationExpiry { get; set; }

}