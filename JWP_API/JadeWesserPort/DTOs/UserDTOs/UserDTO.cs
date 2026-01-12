using JadeWesserPort.Domain.System;

namespace JadeWesserPort.DTOs
{
    public class UserDTO
    {
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public bool HasReadPrivacyPolicy { get; set; }
    }
}
